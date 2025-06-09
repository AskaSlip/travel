import { ISignUp } from '@/models/ISignUp';
import { ISignIn } from '@/models/ISignIn';
import { LocalStorageTokensUpdate } from '@/helpers/localStorageTokensUpdate';
import { IEmail } from '@/models/IEmail';
import { IResetPassword } from '@/models/IResetPassword';
import { ITrip, ITripUpdate } from '@/models/ITrip';
import { IChangePassword } from '@/models/IChangePassword';
import { ITripStop, ITripStopUpdate } from '@/models/ITripStop';
import { IUser, IUserUpdate } from '@/models/IUser';
import { ITicket } from '@/models/ITicket';
import { IBudget } from '@/models/IBudget';


const userService = {
  getAllUsers: async (): Promise<any> => {
    const accessToken = localStorage.getItem('accessToken');

    const response = await fetch('http://localhost:5000/admin/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    });
    const data = await response.json();
    return data.data;
  },

  getCurrentUser: async (): Promise<IUser> => {
    const accessToken = localStorage.getItem('accessToken');

    const response = await fetch('http://localhost:5000/users/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch current user');
    }

    return await response.json();
  },

  updateCurrentUser: async (data: IUserUpdate): Promise<IUser> => {
    const accessToken = localStorage.getItem('accessToken');


    const response = await fetch('http://localhost:5000/users/me', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    return await response.json();
  },

  deleteCurrentUser: async (): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');

    const response = await fetch('http://localhost:5000/users/me', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  },

  uploadAvatar: async (file: File, userId: string): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');

    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch('http://localhost:5000/users/me/avatar', {
      method: 'POST',
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload avatar');
    }
  },
  deleteAvatar: async (): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');

    const response = await fetch('http://localhost:5000/users/me/avatar', {
      method: 'DELETE',
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete avatar');
    }
  },

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
        console.log(errorCode, 'API');
        throw new Error(errorCode);
      }

      const result = await response.json();

      // localStorage.setItem("token_exp", String(Date.now() + 30 * 24 * 60 * 60 * 1000));
      LocalStorageTokensUpdate.updateTokens(result.tokens);
      window.dispatchEvent(new Event('authChanged'));
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
      window.dispatchEvent(new Event('authChanged'));

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
      localStorage.setItem('token_exp', String(Date.now() + 30 * 24 * 60 * 60 * 1000));
      window.dispatchEvent(new Event('authChanged'));

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
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 410) {
          throw new Error('expired');
        }
        throw new Error(errorData.message || 'Failed to verify email');
      }

      const result = await response.json();
      LocalStorageTokensUpdate.updateTokens(result.tokens);
      window.dispatchEvent(new Event('authChanged'));
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
        console.log(errorCode, 'API');
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
        console.log(errorCode, 'API');
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
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorCode = errorData.statusCode;
        console.log(errorCode, 'API');
        throw new Error(errorCode);

      }

    } catch (error: any) {
      console.error('Error:', error);
      throw error;
    }
  },
};

const tripService = {
  createTrip: async (data: ITrip) => {

    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch('http://localhost:5000/trips/create-trip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }
    return response.json();

  },

  updateTrip: async (tripId: string, data: ITripUpdate): Promise<ITrip> => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`http://localhost:5000/trips/${tripId}`, {
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
        console.log(errorCode, 'API');
        throw new Error(errorCode);
      }

      return await response.json();
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
        },
      });
      const data = await responce.json();
      return data.data;
    } catch (error) {
      throw new Error('Failed to get user trips');
    }

  },

  getTripById: async (id: string): Promise<ITrip> => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`http://localhost:5000/trips/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
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
        },
      });
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw new Error('Failed to get trip stops');
    }
  },
  getTripTickets: async (tripId: string): Promise<ITicket[]> => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`http://localhost:5000/trips/${tripId}/tickets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      });
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw new Error('Failed to get trip tickets');
    }
  },

  deleteTrip: async (tripId: string): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`http://localhost:5000/trips/${tripId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorCode = errorData.statusCode;
        console.log(errorCode, 'API');
        throw new Error(errorCode);
      }
    } catch (error) {
      throw error;
    }
  },

  uploadImage: async (file: File, tripId: string): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');

    const formData = new FormData();
    formData.append('trip_picture', file);

    try {
      const response = await fetch(`http://localhost:5000/trips/${tripId}/image`, {
        method: 'POST',
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorCode = errorData.statusCode;
        console.log(errorCode, 'API');
        throw new Error(errorCode);
      }
    } catch (error) {
      throw error;
    }
  },

  deleteImage: async (tripId: string): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`http://localhost:5000/trips/${tripId}/image`, {
        method: 'DELETE',
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorCode = errorData.statusCode;
        console.log(errorCode, 'API');
        throw new Error(errorCode);
      }
    } catch (error) {
      throw error;
    }
  },

};

const tripStopService = {
  createTripStop: async (tripId: string, data: ITripStop): Promise<ITripStop> => {
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
        console.log(errorCode, 'API');
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
        console.log(errorCode, 'API');
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
        console.log(errorCode, 'API');
        throw new Error(errorCode);
      }

    } catch (error) {
      throw error;
    }
  },

  uploadImage: async (file: File, tripStopId: string) => {
    const accessToken = localStorage.getItem('accessToken');

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`http://localhost:5000/trip-stop/${tripStopId}/image`, {
      method: 'POST',
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorCode = errorData.statusCode;
      console.log(errorCode, 'API');
      throw new Error(errorCode);
    }
    return await response.json();
  },

  //todo use this
  deleteImage: async (tripStopId: string): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`http://localhost:5000/trip-stop/${tripStopId}/image`, {
        method: 'DELETE',
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorCode = errorData.statusCode;
        console.log(errorCode, 'API');
        throw new Error(errorCode);
      }
    } catch (error) {
      throw error;
    }
  },
};
const ticketService = {
  createTicket: async (tripId: string, data: ITicket):Promise<ITicket> => {
    const accessToken = localStorage.getItem('accessToken');

    const response = await fetch(`http://localhost:5000/tickets/ticket/${tripId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }
    const createdTicket: ITicket = await response.json();
    return createdTicket;
  },
  deleteTicket: async (ticketId: string) => {
    const accessToken = localStorage.getItem('accessToken');

    const response = await fetch(`http://localhost:5000/tickets/ticket/${ticketId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }
  },
  uploadFile: async (ticketId: string, file: File) => {
    const accessToken = localStorage.getItem('accessToken');

    const formData = new FormData();
    formData.append('file_url', file);

    const response = await fetch(`http://localhost:5000/tickets/${ticketId}/file`, {
      method: 'POST',
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }
  },
  deleteFile: async (ticketId: string) => {
    const accessToken = localStorage.getItem('accessToken');

    const response = await fetch(`http://localhost:5000/tickets/${ticketId}/file`, {
      method: 'DELETE',
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }
  },
}

const budgetService = {
  addCategory: async (tripId: string, data: IBudget): Promise<IBudget> => {
    const accessToken = localStorage.getItem('accessToken');

    const response = await fetch (`http://localhost:5000/budget/budget/${tripId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }
    return await response.json();
  },

  updateCategory: async (budgetId: string, data: {value: string}): Promise<IBudget> => {
    const accessToken = localStorage.getItem('accessToken');

    const response = await fetch(`http://localhost:5000/budget/budget/${budgetId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }
    return await response.json();
  },

  deleteCategory: async (budgetId: string): Promise <void> => {
    const accessToken = localStorage.getItem('accessToken');

    const response = await fetch(`http://localhost:5000/budget/budget/${budgetId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }
    },

  assignMaxBudget: async (tripId: string, data: string): Promise<string> => {
    const accessToken = localStorage.getItem('accessToken');

    const response = await fetch(`http://localhost:5000/trips/${tripId}/max-budget`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
      body: JSON.stringify({ maxBudget: data }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }
    return await response.json();
  },

  getAllBudgetByTripId: async(tripId: string): Promise<IBudget[]> => {
    const accessToken = localStorage.getItem('accessToken');

    const response = await fetch (`http://localhost:5000/trips/${tripId}/budget`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }
    const result = await response.json();
    return result.data;
  }
}


export { authService, passwordService, tripService, tripStopService, userService, ticketService, budgetService };