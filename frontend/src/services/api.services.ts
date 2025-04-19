import { ISignUp } from '@/models/ISignUp';
import { ISignIn } from '@/models/ISignIn';
import { LocalStorageTokensUpdate } from '@/helpers/localStorageTokensUpdate';
import { IEmail } from '@/models/IEmail';
import { IResetPassword } from '@/models/IResetPassword';
import { ITrip } from '@/models/ITrip';
import { IChangePassword } from '@/models/IChangePassword';
import { ITripStop, ITripStopUpdate } from '@/models/ITripStop';


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

      // localStorage.setItem("token_exp", String(Date.now() + 30 * 24 * 60 * 60 * 1000));
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
      localStorage.removeItem('token_exp');
      window.dispatchEvent(new Event("authChanged"))

    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
  refresh: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        throw new Error('No refresh token');
      }

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
      localStorage.setItem("token_exp", String(Date.now() + 30 * 24 * 60 * 60 * 1000));
      window.dispatchEvent(new Event("authChanged"))

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

      if (!response.ok) {
        const errorData = await response.json();
        const errorCode = errorData.statusCode;
        console.log(errorCode, "API");
        throw new Error(errorCode);
      }


    } catch (error) {
      throw error;

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

      if (!response.ok) {
        const errorData = await response.json();
        const errorCode = errorData.statusCode;
        console.log(errorCode, "API");
        throw new Error(errorCode);
      }

    } catch (error) {
      throw error;
    }
  },

  changePassword: async (data: IChangePassword): Promise<void> => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      const response = await fetch('http://localhost:5000/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json();
        const errorCode = errorData.statusCode;
        console.log(errorCode, "API");
        throw new Error(errorCode);

      }

    } catch (error: any) {
      console.error('Error:', error);
      throw error;
    }
  }
};

const tripService = {
  createTrip: async (data: ITrip): Promise<void> => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5000/trips/create-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json();
        const errorCode = errorData.statusCode;
        console.log(errorCode, "API");
        throw new Error(errorCode);
      }
    } catch (error) {
      throw error;
    }
  },

  getUserTrips: async (): Promise<ITrip[]> => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      const responce = await fetch('http://localhost:5000/trips/my-trips', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        }
      });
      const data = await responce.json();
      return data.data;
    } catch (error) {
      throw new Error('Failed to get user trips');
    }

  },

  //todo trip by id (done, but need to make it here)
  getTripById: async (id: string): Promise<ITrip> => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`http://localhost:5000/trips/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to get trip by id');
    }
  },

  getTripStops: async (tripId: string): Promise<ITripStop[]> => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`http://localhost:5000/trips/${tripId}/trip-stops`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        }
      });
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw new Error('Failed to get trip stops');
    }
  }
}

  const tripStopService = {
    createTripStop: async (tripId: string, data: any): Promise<ITripStop> => {
      const accessToken = localStorage.getItem('accessToken');

      try {
        const response = await fetch(`http://localhost:5000/trip-stop/create-stop/${tripId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken ? `Bearer ${accessToken}` : '',
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
        return result;
      } catch (error) {
        throw error;
      }
    },
    updateTripStop: async (tripStopId: string, data: ITripStopUpdate): Promise<ITripStop> => {
      const accessToken = localStorage.getItem('accessToken');

      try {
        const response = await fetch(`http://localhost:5000/trip-stop/${tripStopId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken ? `Bearer ${accessToken}` : '',
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
        return result;
      } catch (error) {
        throw error;
      }
    },

    deleteTripStop: async (tripStopId: string): Promise<void> => {
      const accessToken = localStorage.getItem('accessToken');

      try {
        const response = await fetch(`http://localhost:5000/trip-stop/${tripStopId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken ? `Bearer ${accessToken}` : '',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorCode = errorData.statusCode;
          console.log(errorCode, "API");
          throw new Error(errorCode);
        }

      } catch (error) {
        throw error;
      }
    }
  }



export { authService, passwordService, tripService, tripStopService };