
import { ISignUp } from '@/models/ISignUp';
import { ISignIn } from '@/models/ISignIn';
import { LocalStorageTokensUpdate } from '@/helpers/localStorageTokensUpdate';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
  },
};

export const getAllUsers = async (): Promise<any> => {
  const response = await fetch('http://localhost:5000/admin/users', options);
  const data = await response.json();
  return data.data;

};

const authService = {
  signUp: async (data: ISignUp) => {
    try {
      const response = await fetch('http://localhost:5000/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to sign up');
      }

      const result = await response.json();

      if (result.tokens) {
        localStorage.setItem('accessToken', result.tokens.accessToken);
        localStorage.setItem('refreshToken', result.tokens.refreshToken);
      }


      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
  signIn: async (data: ISignIn) => {
    try {
      const response = await fetch('http://localhost:5000/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to sign in');
      }

      const result = await response.json();

      LocalStorageTokensUpdate.updateTokens(result.tokens);

      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
  signOut: async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      const response = await fetch('http://localhost:5000/auth/sign-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to sign out');
      }

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');


    }catch(error){
       console.error('Error:', error);
        throw error;
      }
    },
  refresh: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');

      const response = await fetch('http://localhost:5000/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: refreshToken ? `Bearer ${refreshToken}` : '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to refresh');
      }

      const result = await response.json();

      LocalStorageTokensUpdate.updateTokens(result);

      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },


};

export { authService };