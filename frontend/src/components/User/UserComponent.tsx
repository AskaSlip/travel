import { IUser } from '@/models/IUser';
import { FC } from 'react';

interface IProps {
    user: IUser;
}

const UserComponent: FC<IProps> = ({user}) => {
  return (
    <div>
      <h1>{user.id}</h1>
      <div>{user.username}</div>
      <div>{user.email}</div>
    </div>
  )
};

export default UserComponent;