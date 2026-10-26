import axiosInstance from "./axiosInstance";

export const faqsApi = {
  // GET /api/v1/faqs
  getFaqs: async (params = {}) => {
    const response = await axiosInstance.get("/api/v1/faqs", { params });
    return response.data;
  },
};

export default faqsApi;
