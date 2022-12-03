import axios from "axios";

const API_URL = " http://localhost:3001";

axios.defaults.baseURL = API_URL;

export interface IPost {
  id: string;
  author: string;
  title: string;
  description: string;
}

export const PostService = {
  async getAll() {
    return axios.get<IPost[]>("/posts");
  },
  async getById(id: string) {
    return axios.get<IPost>(`/posts/${id}`);
  },
  async createPost(data: IPost) {
    return axios.post(`/posts`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },
};
