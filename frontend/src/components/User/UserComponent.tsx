'use client';
import { IUser, IUserUpdate } from '@/models/IUser';
import { FC, useState, useRef } from 'react';
import styles from './UserComponent.module.css';
import FileUploadModal from '@/modals/FileUploadModal';
import { userService } from '@/services/api.services';
import { format, parseISO, parse, toDate } from 'date-fns';

interface IProps {
  user: IUser;
}

const UserComponent: FC<IProps> = ({ user }) => {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<IUser>(user);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updatedUser, setUpdatedUser] = useState<IUserUpdate>(user);

  const handleEditClick = () => {
    setIsEditing(prev => !prev);
  };

  const handleSaveUpdates = async () => {
    const { email, username, birthdate } = updatedUser;
    const userDataToUpdate = { email, username, birthdate };

    try {
      const updatedData = await userService.updateCurrentUser(userDataToUpdate);

      setUpdatedUser((prevUser) => ({
        ...prevUser,
        ...updatedData,
      }));

      setCurrentUser((prevUser) => ({
        ...prevUser,
        ...updatedData,
      }));

      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user', error);
    }
  };

  const handleChangeUserData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === 'birthdate') {
      const parsedDate = parse(value, 'yyyy-MM-dd', new Date());
      const formattedDate = format(parsedDate, 'yyyy-MM-dd');
      console.log(formattedDate);
      setUpdatedUser((prevUser) => ({
        ...prevUser,
        [name]: formattedDate,
      }));
    } else {
      setUpdatedUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await userService.uploadAvatar(file, currentUser.id);

      const newAvatarUrl = URL.createObjectURL(file);

      setCurrentUser(prev => ({
        ...prev,
        avatar: newAvatarUrl,
      }));

      setIsAvatarModalOpen(false);
    } catch (error) {
      console.error('Failed to upload avatar', error);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = () => {
    setIsAvatarModalOpen(true);
  };

  const handleAvatarDelete = async () => {
    try {
      await userService.deleteAvatar();
      setCurrentUser(prev => ({
        ...prev,
        avatar: '',
      }));
    } catch (error) {
      console.error('Failed to delete avatar', error);
    }
  };
  ;

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.avatarWrapper}>
          <img
            src={currentUser.avatar || './default-avatar.jpg'}
            alt={'avatar'}
            className={styles.avatar}
          />
          <div className={styles.avatarBtns}>
            <button onClick={handleAvatarChange}>change</button>
            <button onClick={handleAvatarDelete}>delete</button>
          </div>
        </div>

        <div className={styles.infoContainer}>
          <button className={styles.btn} onClick={handleEditClick}>XXX</button>
          <div className={styles.userInfo}>
            <h1>{user.id}</h1>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={updatedUser.username}
                  onChange={handleChangeUserData}
                />
              ) : (
                <div>{currentUser.username}</div>
              )}
            </div>
            <div>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={updatedUser.email}
                  onChange={handleChangeUserData}
                />
              ) : (
                <div>{currentUser.email}</div>
              )}
            </div>
            <div>
              {isEditing ? (
                <input
                  type="date"
                  name="birthdate"
                  max={format(new Date(), 'yyyy-MM-dd')}
                  value={updatedUser.birthdate ? String(updatedUser.birthdate) : ''}
                  onChange={handleChangeUserData}
                />
              ) : (
                <div>{currentUser.birthdate ? String(currentUser.birthdate) : 'No birthdate'}</div>
              )}
            </div>
          </div>
          {isEditing && (
            <button className={styles.btn} onClick={handleSaveUpdates}>Save</button>
          )}
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <FileUploadModal
        open={isAvatarModalOpen}
        onOpenChangeAction={setIsAvatarModalOpen}
        handleChangeAvatar={openFileDialog}
        textAreas={{
          title: 'Change avatar',
          button: 'Choose new avatar',
        }}
      />
    </div>
  );
};

export default UserComponent;
