import axiosInstance from "./axiosInstance";

export const statsApi = {
  // GET /api/v1/stats/customer
  getCustomerStats: () => {
    return axiosInstance.get("/api/v1/stats/customer");
  },

  // GET /api/v1/stats/representative
  getRepresentativeStats: () => {
    return axiosInstance.get("/api/v1/stats/representative");
  },
};

export default statsApi;
