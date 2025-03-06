import { ITokenPair } from '@/models/ITokenPair';

export class LocalStorageTokensUpdate {
  public static updateTokens(data: ITokenPair): void{
    if (data) {
      if(localStorage.getItem('accessToken') && localStorage.getItem('refreshToken')) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
  }
}