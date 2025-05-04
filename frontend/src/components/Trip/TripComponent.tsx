"use client";
import { FC, useRef, useState } from 'react';
import { ITrip } from '@/models/ITrip';
import styles from './TripComponent.module.css'
import FileUploadModal from '@/modals/FileUploadModal';
import { tripService } from '@/services/api.services';
import { format, parse } from 'date-fns';

interface IProps {
  trip: ITrip;
}

const TripComponent: FC<IProps> = ({trip}) => {


  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentTrip, setCurrentTrip] = useState<ITrip>(trip);
  const [updatedTrip, setUpdatedTrip] = useState<ITrip>(trip);

  const handleEditClick = () => {
    setIsEditing(prev => !prev);
  };

  const handleSaveUpdates = async () => {

    const { trip_name, description, date_of_trip } = updatedTrip;
    const tripDataToUpdate = { trip_name, description, date_of_trip };

    try {
      const updatedData = await tripService.updateTrip(trip.id!, tripDataToUpdate);

      setUpdatedTrip((prevTrip) => ({
        ...prevTrip,
        ...updatedData,
      }));
      setCurrentTrip((prevTrip) => ({
        ...prevTrip,
        ...updatedData,
      }));

      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update trip', error);
    }
  }


  const handleChangeTripData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === 'date_of_trip') {
      const parsedDate = parse(value, 'yyyy-MM-dd', new Date());
      const formattedDate = format(parsedDate, 'yyyy-MM-dd');
      console.log(formattedDate);
      setUpdatedTrip((prevTrip) => ({
        ...prevTrip,
        [name]: formattedDate,
      }));
    } else {
      setUpdatedTrip((prevTrip) => ({
        ...prevTrip,
        [name]: value,
      }));
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await tripService.uploadImage(file, currentTrip.id!);
      const imageUrl = URL.createObjectURL(file);

      setCurrentTrip((prevTrip) => ({
        ...prevTrip,
        trip_picture: imageUrl,
      }));
      setIsModalOpen(false)
    }catch (e){
      console.error('Failed to upload image', e);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = () => {
    setIsModalOpen(true);
  };

  const handleImageDelete = async () => {
    try {
      await tripService.deleteImage(currentTrip.id!);
      setCurrentTrip((prevTrip) => ({
        ...prevTrip,
        trip_picture: '',
      }));
    } catch (error) {
      console.error('Failed to delete image', error);
    }
  };


  return (
    <div>
      <div className={styles.container}>
        <div className={styles.avatarWrapper}>
          <img
            src={currentTrip.trip_picture || '/defaultTripPic.jpg'}
            alt={'picture of trip'}
            className={styles.tripImage}
          />
          <div className={styles.avatarBtns}>
            <button onClick={handleImageChange}>change</button>
            <button onClick={handleImageDelete}>delete</button>
          </div>
        </div>

        <div className={styles.infoContainer}>
          <button className={styles.btn} onClick={handleEditClick}>XXX</button>
          <div className={styles.userInfo}>
            <h1>{trip.id}</h1>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  name="trip_name"
                  value={updatedTrip.trip_name}
                  onChange={handleChangeTripData}
                />
              ) : (
                <div>{currentTrip.trip_name}</div>
              )}
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  name="description"
                  value={updatedTrip.description || ''}
                  onChange={handleChangeTripData}
                />
              ) : (
                <div>{currentTrip.description}</div>
              )}
            </div>
            <div>
              {isEditing ? (
                <input
                  type="date"
                  name="date_of_trip"
                  min={format(new Date(), 'yyyy-MM-dd')}
                  value={
                    updatedTrip.date_of_trip
                      ? String(updatedTrip.date_of_trip)
                      : ''
                  }
                  onChange={handleChangeTripData}
                />
              ) : (
                <div>
                  {currentTrip.date_of_trip
                    ? String(updatedTrip.date_of_trip)
                    : 'choose date'}
                </div>              )}
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
        open={isModalOpen}
        onOpenChangeAction={setIsModalOpen}
        handleChangeAvatar={openFileDialog}
        textAreas={{
          title: 'Change trip picture',
          button: 'Choose new picture',
        }}
      />
    </div>
  )
}

export default TripComponent;