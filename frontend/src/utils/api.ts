// API Configuration
export const API_BASE_URL = 'http://localhost:4000';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh'
  },
  PROFILE: {
    UPDATE: '/profile'
  },
  USER: {
    GET: '/user'
  },
  EVENTS: {
    GET: '/events'
  }
};

// API Response Types
export interface ApiError {
  error: string;
  message?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  token: string;
}

export interface RegisterRequest {
  first: string;
  last: string;
  email: string;
  password: string;
}

export interface ProfileUpdateRequest {
  uid: string;
  first?: string;
  last?: string;
  interests?: string[];
}

export interface ProfileUpdateResponse {
  uid: string;
  status: string;
}

export interface UserStatsResponse {
  id: string;
  first: string;
  last: string;
  email: string;
  interests: string[];
  eventsSeen: number;
  eventsAttended: number;
  createdAt: string;
}

// Generic API call function
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw data;
  }
  
  return data;
}

// Auth API functions
export const authAPI = {
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    return apiCall<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    return apiCall<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
};

// Profile API functions
export const profileAPI = {
  update: async (profileData: ProfileUpdateRequest): Promise<ProfileUpdateResponse> => {
    return apiCall<ProfileUpdateResponse>(API_ENDPOINTS.PROFILE.UPDATE, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// User API functions
export const userAPI = {
  getStats: async (userId: string): Promise<UserStatsResponse> => {
    return apiCall<UserStatsResponse>(`${API_ENDPOINTS.USER.GET}/${userId}`, {
      method: 'GET',
    });
  },
};

// Events API functions
export const eventsAPI = {
  getEvents: async (userId: string): Promise<any[]> => {
    return apiCall<any[]>(`${API_ENDPOINTS.EVENTS.GET}?uid=${userId}`, {
      method: 'GET',
    });
  },
};