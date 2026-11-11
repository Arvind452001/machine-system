import { axiosInstance } from "./axiosInstance";

export const contentApi = {
  // Get content by slug (e.g. 'privacy', 'terms')
  getContentBySlug: async (slug) => {
    const response = await axiosInstance.get(`/api/v1/content/${slug}`);
    return response.data;
  },

  // Get all published pages
  getAllContent: async () => {
    const response = await axiosInstance.get("/api/v1/content");
    return response.data;
  },
};

export default contentApi;
