import axiosInstance from "./axiosInstance";

/**
 * Machines API Service
 * - GET /api/v1/machines
 * - GET /api/v1/machines/{idOrSlug}
 */
export const machinesApi = {
  /**
   * Fetch all machines with optional query parameters
   * @param {Object} [params] - Optional filters like category, search, priceRange
   * @returns {Promise<{ success: boolean, count: number, data: Array }>}
   */
  getMachines: (params = {}) => {
    return axiosInstance.get("/api/v1/machines", { params });
  },

  /**
   * Fetch single machine details by ID or Slug
   * @param {string} idOrSlug - Machine Mongo ID or unique slug (e.g. 'ms-v850', 'ms-l4000')
   * @returns {Promise<{ success: boolean, data: Object }>}
   */
  getMachine: (idOrSlug) => {
    return axiosInstance.get(`/api/v1/machines/${idOrSlug}`);
  },
};

export default machinesApi;
