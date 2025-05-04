'use client';
import { authService, userService } from '@/services/api.services';
import UserComponent from '@/components/User/UserComponent';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { userActions } from '@/redux/slices/userSlice';
import DeleteUserModal from '@/modals/DeleteUserModal';
//todo зробити повідомлку про видалення акаунта і чи ви впевнені
const MyCabinetPage = () => {

  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  let { user } = useAppSelector(state => state.userSlice);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  const handleDeleteAccount = async () => {
    try {
        await userService.deleteCurrentUser()

      setIsDeleted(true);
        dispatch(userActions.resetUser());

        setIsModalOpen(false);

      setTimeout(() => router.push('/'), 5000);
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleConfirmEmail = async () => {
    if(user)
    await authService.resendConfirmation(user.email)
  }

  return (
    <div>
      {isDeleted ? (
          <h1>Account deleted</h1>
        ) :
        (
          <div>
            <div>
              {user && <UserComponent user={user} />}
            </div>
            <div>
              <Link href={'/change-password'}>
                <button>Change password</button>
              </Link>
            </div>
            <div>
              <h1>here achieves</h1>
            </div>
              <div>
                {
                  user?.isVerify === false ? (
                    <button onClick={handleConfirmEmail}>confirm your email</button>
                  ) : null
                }
              </div>
            <div>
              <button onClick={handleOpenModal}>
                delete account
              </button>
            </div>
          </div>
        )
      }
      <DeleteUserModal open={isModalOpen} onOpenChangeAction={setIsModalOpen} handleDeleteUser={handleDeleteAccount}/>
    </div>
  );
};
export default MyCabinetPage;