import axiosInstance from "./axiosInstance";

export const savedMachinesApi = {
  // GET /api/v1/saved-machines/my (Get customer's saved machine configurations)
  getMySavedMachines: () => {
    return axiosInstance.get("/api/v1/saved-machines/my");
  },

  // POST /api/v1/saved-machines (Save a customized configuration to customer account)
  saveMachine: (payload) => {
    return axiosInstance.post("/api/v1/saved-machines", payload);
  },

  // GET /api/v1/saved-machines/:id
  getSavedMachineById: (id) => {
    return axiosInstance.get(`/api/v1/saved-machines/${id}`);
  },

  // DELETE /api/v1/saved-machines/:id (Delete saved machine configuration)
  deleteSavedMachine: (id) => {
    return axiosInstance.delete(`/api/v1/saved-machines/${id}`);
  },
};

export default savedMachinesApi;

