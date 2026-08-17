import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@studentspend_token';
const USER_KEY = '@studentspend_user';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
}

export const saveAuthData = async (
  token: string,
  user: StoredUser,
): Promise<void> => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(TOKEN_KEY);
};

export const getStoredUser = async (): Promise<StoredUser | null> => {
  const user = await AsyncStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  return JSON.parse(user);
};

export const clearAuthData = async (): Promise<void> => {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
};