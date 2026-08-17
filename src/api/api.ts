const API_URL = 'http://10.0.2.2:5000/api';

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  try {
    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,

        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
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