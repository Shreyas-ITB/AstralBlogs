import express from 'express';
import multer from 'multer';
import imgbbUploader from 'imgbb-uploader';
import amazonScraper from 'amazon-buddy';
import Post from '../models/Post.js';
import axios from 'axios';
import followRedirects from 'follow-redirects';
const { https } = followRedirects;
const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Error: Images Only!'));
    }
  }
});

// Function to upload image to ImgBB
async function uploadToImgBB(imageBuffer) {
  try {
    const response = await imgbbUploader({
      apiKey: process.env.IMGBB_API_KEY,
      base64string: imageBuffer.toString('base64'),
    });
    return response.url;
  } catch (error) {
    console.error('ImgBB upload error:', error);
    throw new Error('Failed to upload image to ImgBB');
  }
}

router.get('/amazon-product', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // 1. Get the final redirected URL
    const finalUrl = await new Promise((resolve, reject) => {
      https.get(url, (response) => {
        resolve(response.responseUrl); // <- This gives the final URL
      }).on('error', reject);
    });

    // 2. Extract ASIN from the final URL
    const asinMatch = finalUrl.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/);
    if (!asinMatch) {
      return res.status(400).json({ error: 'ASIN not found in URL' });
    }
    const asin = asinMatch[1];

    // 3. Use amazon-buddy
    const productResult = await amazonScraper.asin({ asin, country: 'IN' });
    const product = productResult.result[0];

    res.json({
      title: product.title,
      image: product.main_image,
      price: product.price.current_price
    });

  } catch (error) {
    console.error('Error fetching Amazon product:', error);
    res.status(500).json({ error: 'Failed to fetch product information' });
  }
});

// Get all posts (latest 50)
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single post by ID
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search posts by title
router.get('/posts/search', async (req, res) => {
  try {
    const { title } = req.query;
    let query = {};
    if (title) {
      query = { $text: { $search: title } };
    }
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new post
router.post('/postcontent', upload.array('images', 10), async (req, res) => {
  try {
    const { title, content, shortDescription, links } = req.body;
    const currentTime = req.body.currentTime || new Date().toISOString();
    
    // Process links
    let processedLinks = [];
    if (links) {
      if (Array.isArray(links)) {
        processedLinks = links;
      } else if (typeof links === 'string') {
        try {
          const parsed = JSON.parse(links);
          processedLinks = Array.isArray(parsed) ? parsed : [links];
        } catch (e) {
          processedLinks = [links];
        }
      }
    }

    // Upload images to ImgBB
    const imgbbUrls = await Promise.all(
      req.files.map(file => uploadToImgBB(file.buffer))
    );
    
    const newPost = new Post({
      title,
      content,
      images: imgbbUrls,
      shortDescription,
      links: processedLinks,
      createdAt: currentTime
    });
    
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;