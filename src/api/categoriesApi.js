import axiosInstance from "./axiosInstance";

/**
 * Categories API Service
 * - GET /api/v1/categories
 */
export const categoriesApi = {
  /**
   * Fetch all categories
   * @returns {Promise<{ success: boolean, count: number, names: Array<string>, data: Array<Object> }>}
   */
  getCategories: () => {
    return axiosInstance.get("/api/v1/categories");
  },
};

export default categoriesApi;
