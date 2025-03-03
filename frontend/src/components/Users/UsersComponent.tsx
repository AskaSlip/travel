'use client'
import { FC, useEffect, useState } from 'react';
import { IUser } from '@/models/IUser';
import { getAllUsers } from '@/services/api.services';
import UserComponent from '@/components/User/UserComponent';

interface IProps {
  users: IUser[];
}

const UsersComponent:FC = () => {

  const [allUsers, setAllUsers] = useState<IUser[]>([]);

  useEffect(() => {
    getAllUsers().then( (user) => {
      setAllUsers(user);
    })
  }, []);

  return (
    <div>
      {allUsers.map((user: IUser) => (
        <div key={user.id}>
        <UserComponent user={user}/>
      </div>
      )
      )}
    </div>
  )
};

export default UsersComponent;