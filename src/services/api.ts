import axios from 'axios';
import { BlogPost, SearchResults } from '../types';

const API_URL = 'http://localhost:5000/api';

// Fetch the most recent 50 posts
export const fetchPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// Fetch a single post by ID
export const fetchPostById = async (id: string): Promise<BlogPost> => {
  try {
    const response = await axios.get(`${API_URL}/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    throw error;
  }
};

// Search posts by title
export const searchPosts = async (query: string): Promise<BlogPost[]> => {
  try {
    const response = await axios.get(`${API_URL}/posts/search?title=${query}`);
    return response.data;
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
};

// Create a new post
// export const createPost = async (postData: FormData): Promise<BlogPost> => {
//   try {
//     const response = await axios.post(`${API_URL}/postcontent`, postData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error creating post:', error);
//     throw error;
//   }
// };