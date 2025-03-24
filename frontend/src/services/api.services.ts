import { ISignUp } from '@/models/ISignUp';
import { ISignIn } from '@/models/ISignIn';
import { LocalStorageTokensUpdate } from '@/helpers/localStorageTokensUpdate';
import { IEmail } from '@/models/IEmail';
import { IResetPassword } from '@/models/IResetPassword';
import { ITrip } from '@/models/ITrip';
import data from '@react-google-maps/api/src/components/drawing/Data';


export const getAllUsers = async (): Promise<any> => {
  const response = await fetch('http://localhost:5000/admin/users', {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  });
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
        window.dispatchEvent(new Event("authChanged"));
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
        const errorData = await response.json();
        const errorCode = errorData.statusCode;
        console.log(errorCode, "API");
        throw new Error(errorCode);
      }

      const result = await response.json();

      LocalStorageTokensUpdate.updateTokens(result.tokens);
      window.dispatchEvent(new Event("authChanged"))
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
        },
      });

      if (!response.ok) {
        throw new Error('Failed to sign out');
      }

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.dispatchEvent(new Event("authChanged"))

    } catch (error) {
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

  verifyEmail: async (token: string): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:5000/auth/verify-email?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 410) {
          throw new Error("expired");
        }
        throw new Error(errorData.message || "Failed to verify email");
      }

      const result = await response.json();
      LocalStorageTokensUpdate.updateTokens(result.tokens);
      window.dispatchEvent(new Event("authChanged"))
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  resendConfirmation: async (email: string): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:5000/auth/resend-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to resend confirmation');
      }

    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },


};

const passwordService = {
  forgotPassword: async (data: IEmail): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });


    } catch (error) {
      throw new Error('Failed to send email');

    }
  },

  resetPassword: async (data: IResetPassword): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5000/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });


    } catch (error) {
      throw new Error('Failed to reset password');
    }
  },
};

const tripService = {
  createTrip: async (data: ITrip): Promise<void> => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await fetch('http://localhost:5000/trips/create-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
        body: JSON.stringify(data),
      })
    } catch (error) {
      throw new Error('Failed to create trip');
    }
  },

  getUserTrips: async (): Promise <ITrip[]> => {
    const accessToken = localStorage.getItem('accessToken');

    try{
      const responce = await fetch('http://localhost:5000/trips/my-trips', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        }
      });
      const data = await responce.json();
      return data.data;
    }catch(error){
      throw new Error('Failed to get user trips');
    }

  }

  //todo trip by id (done, but need to make it here)

};

export { authService, passwordService, tripService };