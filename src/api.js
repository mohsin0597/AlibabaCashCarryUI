export const apiFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return response;
  } catch (error) {
    localStorage.removeItem('authToken');

    if (window.location.pathname !== '/login') {
      window.location.replace('/login');
    }

    throw error;
  }
};
