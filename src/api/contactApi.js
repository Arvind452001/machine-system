import axiosInstance from "./axiosInstance";



export const contactApi = {
  // POST /api/v1/contact
  createContact: (data) => {
    return axiosInstance.post("/api/v1/contact", data);
  },
};

export default contactApi;