import { axiosInstance } from "./axiosInstance";


export const enquiriesApi = {
  // POST /api/v1/enquiries
  createEnquiry: (data) => {
    return axiosInstance.post("/api/v1/enquiries", data);
  },

  // GET /api/v1/enquiries/my
  getMyEnquiries: (params = {}) => {
    return axiosInstance.get("/api/v1/enquiries/my", { params });
  },

  // GET /api/v1/enquiries/assigned
  getAssignedEnquiries: (params = {}) => {
    return axiosInstance.get("/api/v1/enquiries/assigned", { params });
  },

  // GET /api/v1/enquiries/:id
  getEnquiryById: (id) => {
    return axiosInstance.get(`/api/v1/enquiries/${id}`);
  },

  // PATCH /api/v1/enquiries/:id/status (Update workflow status by Assigned Rep or Admin)
  updateStatus: (id, { status, note }) => {
    return axiosInstance.patch(`/api/v1/enquiries/${id}/status`, { status, note });
  },

  // PUT /api/v1/enquiries/:id
  updateEnquiry: (id, data) => {
    return axiosInstance.put(`/api/v1/enquiries/${id}`, data);
  },
};

export default enquiriesApi;
