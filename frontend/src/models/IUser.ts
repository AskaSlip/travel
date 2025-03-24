import { RoleEnum } from '@/enums/role-enum';

export interface IUser {
  id: string;
  email: string;
  username: string;
  role: RoleEnum;
  birthdate?: string;
  isVerify: boolean;
  avatar?: string;
}