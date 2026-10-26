import axiosInstance from "./axiosInstance";

export const reviewsApi = {
  // GET /api/v1/reviews
  getReviews: async (params = {}) => {
    const response = await axiosInstance.get("/api/v1/reviews", { params });
    return response.data;
  },

  // POST /api/v1/reviews
  createReview: async (payload) => {
    const response = await axiosInstance.post("/api/v1/reviews", payload);
    return response.data;
  },
};

export default reviewsApi;
