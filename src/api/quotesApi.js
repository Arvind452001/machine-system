import axiosInstance, { getAuthToken } from "./axiosInstance";

const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "https://node.aitechnotech.in/machine";
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "");
const BASE_URL = normalizedBaseUrl.endsWith("/api/v1")
  ? normalizedBaseUrl.slice(0, -7)
  : normalizedBaseUrl;

export const quotesApi = {
  // GET /api/v1/quotes/my (Customer view their received quotations)
  getMyQuotes: () => {
    return axiosInstance.get("/api/v1/quotes/my");
  },

  // GET /api/v1/quotes/representative (Representative get quotes assigned or prepared by them)
  getRepresentativeQuotes: async () => {
    try {
      const res = await axiosInstance.get("/api/v1/quotes/representative");
      if (res?.data && (Array.isArray(res.data) || Array.isArray(res.data?.data))) {
        return res;
      }
      return res;
    } catch {
      // Fallback to /api/v1/quotes if /representative endpoint is not active
      return axiosInstance.get("/api/v1/quotes");
    }
  },

  // GET /api/v1/quotes/{id} (Get single quote details by ID or Quote Number)
  getQuoteById: (id) => {
    return axiosInstance.get(`/api/v1/quotes/${id}`);
  },

  // POST /api/v1/quotes (Create and issue a commercial quotation - Admin & Representative)
  createQuote: (quoteData) => {
    return axiosInstance.post("/api/v1/quotes", quoteData);
  },

  // PUT /api/v1/quotes/{id} (Update quote details, pricing, options, validity, or terms)
  updateQuote: (id, quoteData) => {
    return axiosInstance.put(`/api/v1/quotes/${id}`, quoteData);
  },

  // DELETE /api/v1/quotes/{id} (Delete quotation from database)
  deleteQuote: (id) => {
    return axiosInstance.delete(`/api/v1/quotes/${id}`);
  },

  // PATCH /api/v1/quotes/{id}/status (Customer accepts/declines, Admin & Rep change workflow state)
  updateStatus: (id, { status, rejectionReason, note }) => {
    return axiosInstance.patch(`/api/v1/quotes/${id}/status`, {
      status,
      rejectionReason,
      note,
    });
  },

  // GET /api/v1/quotes/{id}/pdf (Download or stream generated Quotation PDF)
  downloadPdf: async (id, quoteNumber = "quote") => {
    const token = getAuthToken();
    const res = await fetch(`${BASE_URL}/api/v1/quotes/${id}/pdf`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) {
      throw new Error(`PDF download failed with status ${res.status}`);
    }
    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `${quoteNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
    return true;
  },

  // GET /api/v1/quotes/export-csv (Export all quotations to CSV file - Admin & Representative)
  exportCsv: async () => {
    const token = getAuthToken();
    const res = await fetch(`${BASE_URL}/api/v1/quotes/export-csv`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) {
      throw new Error(`Export failed with status ${res.status}`);
    }
    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `representative-quotes-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
    return true;
  },
};

export default quotesApi;
