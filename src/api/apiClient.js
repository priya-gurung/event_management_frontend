const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const BASE_URL = rawBase.replace(/\/+$/, '').replace(/\/api$/, '') + '/api';

const apiClient = async (endpoint, options = {}) => {
  const { params, body, headers, ...customConfig } = options;

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const pathWithoutApi = cleanEndpoint.replace(/^\/api/, '');

  let url = `${BASE_URL}${pathWithoutApi}`;
  
  if (params && Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString();
    url += `?${queryString}`;
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...customConfig,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorMessage = 'Request failed';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export default apiClient;
