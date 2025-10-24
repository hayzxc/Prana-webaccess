import { cache, createCacheKey } from "./cache";
import {
  Certificate,
  ConsultationRequest,
  FumigationTracking,
  GasReading,
  RecordSheet,
  RecordSheetWithReadings,
  Role,
  SafeUser,
} from "@/types";

interface RequestOptions {
  cacheTTL?: number;
  // All other fetch options from RequestInit
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit | null;
  mode?: RequestMode;
  credentials?: RequestCredentials;
  cache?: RequestCache;
  redirect?: RequestRedirect;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  integrity?: string;
  keepalive?: boolean;
  signal?: AbortSignal | null;
  window?: any;
}

class ApiClient {
  private baseURL: string;
  private pendingRequests = new Map<string, Promise<any>>();

  constructor(baseURL = "/api") {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      cache: useCache = true,
      cacheTTL = 5 * 60 * 1000,
      ...fetchOptions
    } = options;
    const url = `${this.baseURL}${endpoint}`;
    const method = fetchOptions.method || "GET";

    // Create cache key
    const cacheKey = createCacheKey(
      method,
      endpoint,
      JSON.stringify(fetchOptions.body)
    );

    // Check cache for GET requests
    if (method === "GET" && useCache) {
      const cachedData = cache.get<T>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    // Deduplicate identical requests
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    // Make the request
    const requestPromise = fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
      signal: controller.signal,
      ...fetchOptions,
    })
      .then(async (response) => {
        clearTimeout(timeoutId);
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
          } catch {
            errorMessage = errorText || errorMessage;
          }
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .then((data) => {
        // Cache successful GET requests
        if (method === "GET" && useCache) {
          cache.set(cacheKey, data, cacheTTL);
        }
        return data;
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please try again');
        }
        throw error;
      })
      .finally(() => {
        // Remove from pending requests
        this.pendingRequests.delete(cacheKey);
      });

    // Store pending request
    this.pendingRequests.set(cacheKey, requestPromise);

    return requestPromise;
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }

  clearCache(): void {
    cache.clear();
  }

  invalidateCache(pattern?: string): void {
    if (pattern) {
      // In a real implementation, you'd implement pattern matching
      // For now, just clear all cache
      cache.clear();
    } else {
      cache.clear();
    }
  }
}

export const apiClient = new ApiClient();

// Fungsi helper untuk menangani response
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = "Something went wrong";
    try {
      const error = await response.json();
      errorMessage = error.error || error.message || errorMessage;
    } catch (_parseError) {
      // Jika response bukan JSON, gunakan statusText
      errorMessage = response.statusText || `Error: ${response.status}`;
    }
    throw new Error(errorMessage);
  }
  // Menangani response 204 No Content (untuk DELETE)
  if (response.status === 204) {
    return { success: true };
  }
  
  // Pastikan response ada content sebelum parse JSON
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  
  // Jika bukan JSON, return success
  return { success: true };
};

// ===================================
//              USERS API
// ===================================
export const fetchUsers = async (): Promise<SafeUser[]> => {
  const response = await fetch("/api/users");
  const result = await handleResponse(response);
  return result.data;
};

// ===================================
//          CERTIFICATES API
// ===================================
export const fetchCertificates = async (): Promise<Certificate[]> => {
  const response = await fetch("/api/certificates");
  const result = await handleResponse(response);
  return result.data;
};

export const createCertificate = async (
  data: Partial<Certificate>
): Promise<Certificate> => {
  const response = await fetch("/api/certificates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await handleResponse(response);
  return result.data;
};

export const deleteCertificate = async (
  id: string
): Promise<{ success: boolean }> => {
  const response = await fetch(`/api/certificates/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};

// ===================================
//       FUMIGATION TRACKING API
// ===================================
export const fetchFumigationTrackings = async (): Promise<
  FumigationTracking[]
> => {
  const response = await fetch("/api/fumigation-trackings");
  const result = await handleResponse(response);
  return result.data;
};

export const createFumigationTracking = async (
  data: Partial<FumigationTracking>
): Promise<FumigationTracking> => {
  const response = await fetch("/api/fumigation-trackings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await handleResponse(response);
  return result.data;
};

// ===================================
//            FILE UPLOAD API
// ===================================
export const uploadFile = async (
  file: File
): Promise<{ url: string; fileName: string; fileSize: number }> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  const result = await handleResponse(response);
  return result;
};

export const updateFumigationTracking = async (
  id: string,
  data: Partial<FumigationTracking>
): Promise<FumigationTracking> => {
  const response = await fetch(`/api/fumigation-trackings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await handleResponse(response);
  return result.data;
};

export const deleteFumigationTracking = async (
  id: string
): Promise<{ success: boolean }> => {
  const response = await fetch(`/api/fumigation-trackings/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};

// ===================================
//          RECORD SHEETS API
// ===================================

export const fetchRecordSheets = async (
  certificateId: string
): Promise<RecordSheetWithReadings[]> => {
  const response = await fetch(
    `/api/record-sheets?certificateId=${certificateId}`
  );
  const result = await handleResponse(response);
  return result.data;
};

export const createRecordSheet = async (
  data: Partial<RecordSheet>
): Promise<RecordSheet> => {
  const response = await fetch("/api/record-sheets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await handleResponse(response);
  return result.data;
};

export const createGasReading = async (
  sheetId: string,
  data: Partial<GasReading>
): Promise<GasReading> => {
  const response = await fetch(`/api/record-sheets/${sheetId}/readings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await handleResponse(response);
  return result.data;
};

// ===================================
//              USERS API (Lanjutan)
// ===================================

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: Role;
}): Promise<SafeUser> => {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await handleResponse(response);
  return result.data;
};

export const updateUser = async (
  id: string,
  data: Partial<SafeUser>
): Promise<SafeUser> => {
  const response = await fetch(`/api/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await handleResponse(response);
  return result.data;
};

export const deleteUser = async (id: string): Promise<{ success: boolean }> => {
  const response = await fetch(`/api/users/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};

export const fetchMyRecordSheets = async (): Promise<
  RecordSheetWithReadings[]
> => {
  const response = await fetch(`/api/record-sheets`);
  const result = await handleResponse(response);
  return result.data;
};

// ===================================
//       PUBLIC TRACKING API
// ===================================

export const searchFumigationTracking = async (
  containerNumber: string,
  noticeId: string
): Promise<FumigationTracking | null> => {
  const response = await fetch(
    `/api/tracking?containerNumber=${containerNumber}&noticeId=${noticeId}`
  );

  if (response.status === 404) {
    return null;
  }

  const result = await handleResponse(response);
  return result.data;
};

export const deleteRecordSheet = async (sheetId: string): Promise<void> => {
  const response = await fetch(`/api/record-sheets/${sheetId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete record sheet.");
  }
};

// ===================================
//      CONSULTATION REQUESTS API
// ===================================

export const fetchConsultationRequests = async (): Promise<ConsultationRequest[]> => {
  const response = await fetch("/api/consultation-requests");
  return handleResponse(response);
};

export const createConsultationRequest = async (
  data: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    companyName?: string;
    serviceType?: string;
    message: string;
  }
): Promise<ConsultationRequest> => {
  const response = await fetch("/api/consultation-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateConsultationRequest = async (
  id: string,
  data: {
    status?: string;
    adminNotes?: string;
  }
): Promise<ConsultationRequest> => {
  const response = await fetch(`/api/consultation-requests/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteConsultationRequest = async (id: string): Promise<{ success: boolean }> => {
  const response = await fetch(`/api/consultation-requests/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};
