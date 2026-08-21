import {getToken} from '../storage/authStorage';

const API_URL =
  'https://studentspend-api.onrender.com/api';

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  try {
    // Get the currently stored JWT
    const token = await getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add JWT authentication when a token exists
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Preserve any custom headers supplied by the caller
    if (options.headers) {
      Object.assign(
        headers,
        options.headers,
      );
    }

    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,
        headers,
      },
    );

    const data: any =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          'Something went wrong.',
      );
    }

    return data as T;

  } catch (error) {

    console.log(
      'API request error:',
      error,
    );

    throw error;
  }
};