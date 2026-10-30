import { authApi } from "./authApi";
import { machinesApi } from "./machinesApi";
import { enquiriesApi } from "./enquiriesApi";
import { quotesApi } from "./quotesApi";
import { optionsApi } from "./optionsApi";
import { statsApi } from "./statsApi";
import { renderingsApi } from "./renderingsApi";
import { usersApi } from "./usersApi";
import { reviewsApi } from "./reviewsApi";
import { faqsApi } from "./faqsApi";
import { axiosInstance, getAuthToken, STORAGE_KEY } from "./axiosInstance";
import { contactApi } from "./contactApi";

export const apiClient = {
  // Auth
  login: (credentials) => authApi.login(credentials),
  register: (userData) => authApi.register(userData),
  getMe: () => authApi.getMe(),
  updateProfile: (profileData) => authApi.updateProfile(profileData),

  // Machines
  getMachines: (params = {}) => machinesApi.getMachines(params),
  getMachine: (idOrSlug) => machinesApi.getMachine(idOrSlug),
  getCategories: () => machinesApi.getCategories ? machinesApi.getCategories() : axiosInstance.get("/api/v1/machines/categories"),

  // Options & Rules
  getOptions: (params = {}) => optionsApi.getOptions(params),
  validateOptions: (data) => optionsApi.validateOptions(data),

  // Contact
  createContact: (data) => contactApi.createContact(data),
  submitContact: (data) => contactApi.createContact(data),

  // Enquiries
  createEnquiry: (data) => enquiriesApi.createEnquiry(data),
  getMyEnquiries: (params = {}) => enquiriesApi.getMyEnquiries(params),
  getAssignedEnquiries: (params = {}) => enquiriesApi.getAssignedEnquiries(params),
  getEnquiries: (params = {}) => enquiriesApi.getMyEnquiries(params),
  getEnquiry: (id) => enquiriesApi.getEnquiryById(id),
  updateEnquiry: (id, data) => enquiriesApi.updateEnquiry(id, data),
  updateEnquiryStatus: (id, data) => enquiriesApi.updateStatus(id, data),

  // Quotations
  getMyQuotes: () => quotesApi.getMyQuotes(),
  getRepresentativeQuotes: () => quotesApi.getRepresentativeQuotes(),
  getQuotations: (params = {}) => {
    // Determine based on current user role in localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const u = JSON.parse(stored);
        if (u.role === "representative") {
          return quotesApi.getRepresentativeQuotes();
        }
      }
    } catch {}
    return quotesApi.getMyQuotes();
  },
  getQuotation: (id) => quotesApi.getQuoteById(id),
  createQuotation: (data) => quotesApi.createQuote(data),
  updateQuotation: (id, data) => quotesApi.updateQuote(id, data),
  updateQuoteStatus: (id, data) => quotesApi.updateStatus(id, data),
  downloadQuotePdf: (id, number) => quotesApi.downloadPdf(id, number),
  exportQuotesCsv: () => quotesApi.exportCsv(),
  deleteQuotation: (id) => quotesApi.deleteQuote(id),

  // Dashboards & Telemetry (GET /api/v1/stats/...)
  getCustomerDashboard: () => statsApi.getCustomerStats(),
  getRepresentativeDashboard: () => statsApi.getRepresentativeStats(),

  // Team & Representatives (GET /api/v1/users/representatives)
  getRepresentatives: () => usersApi.getRepresentatives(),
  getCustomers: () => usersApi.getRepresentatives(),
  getCustomerDetail: (id) => enquiriesApi.getEnquiryById(id),

  // Visuals & Renderings
  getRenderings: (params = {}) => renderingsApi.getRenderings(params),

  // Reviews
  getReviews: (params = {}) => reviewsApi.getReviews(params),
  createReview: (payload) => reviewsApi.createReview(payload),

  // FAQs
  getFaqs: (params = {}) => faqsApi.getFaqs(params),
};

export {
  authApi,
  machinesApi,
  enquiriesApi,
  quotesApi,
  optionsApi,
  statsApi,
  renderingsApi,
  usersApi,
  reviewsApi,
  faqsApi,
  contactApi,
  axiosInstance,
  getAuthToken,
  STORAGE_KEY,
};
export default apiClient;
