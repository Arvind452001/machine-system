import axiosInstance from "./axiosInstance";

export const usersApi = {
  // GET /api/v1/users/representatives
  getRepresentatives: () => {
    return axiosInstance.get("/api/v1/users/representatives");
  },
};

export default usersApi;
