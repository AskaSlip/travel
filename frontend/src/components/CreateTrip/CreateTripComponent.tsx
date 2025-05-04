'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { tripService } from '@/services/api.services';
import { CreateTripFormData, createTripSchema } from '@/validator/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { format, parse } from 'date-fns';
//todo add calender to choose date
const CreateTripComponent = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    setError,
  } = useForm<CreateTripFormData>({
    resolver: zodResolver(createTripSchema)
  });


  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("trip_picture", file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmitCreateTripForm: SubmitHandler<CreateTripFormData> = async (data): Promise<void> => {
    try {

      const file = data.trip_picture instanceof File ? data.trip_picture : null;

      const tripResponse = await tripService.createTrip({
        ...data,
        date_of_trip: data.date_of_trip
          ? format(data.date_of_trip, 'yyyy-MM-dd')
          : null,
        trip_picture: undefined,
      });

      if (file) {
        await tripService.uploadImage(file, tripResponse.id);
        console.log('Image uploaded', data.trip_picture);
      }

      reset();
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }


      console.log('trip done', data);
    } catch (error:any) {
      console.error('Failed to create trip in component', error);

      if (error.statusCode === 403) {
        setError('root', {
          type: 'manual',
          message: error.message || 'You can create only one trip before email confirmation',
        });
      } else {
        setError('root', {
          type: 'manual',
          message: error.message || 'Something went wrong',
        });
      }
    }}

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitCreateTripForm)}>
        <input type={'text'} {...register('trip_name', {required: true})} placeholder={'Enter Trip name'} />
        {errors?.trip_name && <span>This field is required</span>}
        <input type={'text'} {...register('description')} placeholder={'Enter some description'} />
        <input type={'date'} {...register('date_of_trip')} placeholder={'choose the date'} min={format(new Date(), 'yyyy-MM-dd')} />
        {errors?.date_of_trip && <span>{errors.date_of_trip.message}</span>}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {errors?.trip_picture?.message && <span>{String(errors.trip_picture.message)}</span>}

        {previewImage && (
          <div>
            <p>Preview:</p>
            <img src={previewImage} alt="Preview" style={{ maxWidth: '300px', marginTop: '10px' }} />
          </div>
        )}

        <button type={'submit'}>Create trip</button>
      </form>
      {errors?.root && <span>{String(errors.root.message)}</span>}

    </div>
  );
};

export default CreateTripComponent;