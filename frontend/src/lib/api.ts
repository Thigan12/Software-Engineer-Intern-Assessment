const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface RequestOptions extends RequestInit {
  data?: any;
}

export async function apiFetch<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers, ...customConfig } = options;

  const url = `${API_BASE_URL.replace(/\/$/, '')}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    // CRITICAL: credentials: 'include' enables browser to transmit and accept
    // HTTP-only cookies across origins (Vercel <-> Render) and localhost
    credentials: 'include',
    ...customConfig,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);

  if (response.status === 204) {
    return {} as T;
  }

  let responseData: any;
  try {
    responseData = await response.json();
  } catch {
    responseData = null;
  }

  if (!response.ok) {
    let errorMessage = 'An unexpected error occurred';
    if (responseData) {
      if (Array.isArray(responseData.message)) {
        errorMessage = responseData.message.join(', ');
      } else if (typeof responseData.message === 'string') {
        errorMessage = responseData.message;
      } else if (responseData.error) {
        errorMessage = responseData.error;
      }
    }
    throw new Error(errorMessage);
  }

  return responseData as T;
}
