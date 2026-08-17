import {
  apiRequest,
} from './api';


// ========================================
// LOGIN RESPONSE
// ========================================

export interface LoginResponse {
  message: string;

  token: string;

  user: {
    id: string;
    name: string;
    email: string;
  };
}


// ========================================
// REGISTER RESPONSE
// ========================================

export interface RegisterResponse {
  message: string;

  token: string;

  user: {
    id: string;
    name: string;
    email: string;
  };
}


// ========================================
// LOGIN
// ========================================

export const loginUser = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {

  return apiRequest<LoginResponse>(
    '/auth/login',
    {
      method: 'POST',

      body: JSON.stringify({
        email,
        password,
      }),
    },
  );
};


// ========================================
// REGISTER
// ========================================

export const registerUser = async (
  name: string,
  email: string,
  password: string,
): Promise<RegisterResponse> => {

  return apiRequest<RegisterResponse>(
    '/auth/register',
    {
      method: 'POST',

      body: JSON.stringify({
        name,
        email,
        password,
      }),
    },
  );
};