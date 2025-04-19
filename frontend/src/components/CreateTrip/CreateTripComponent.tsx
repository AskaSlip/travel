'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { tripService } from '@/services/api.services';
import { CreateTripFormData, createTripSchema } from '@/validator/validation';
import { zodResolver } from '@hookform/resolvers/zod';
//todo add calender to choose date
//todo add photo upload
const CreateTripComponent = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTripFormData>({
    resolver: zodResolver(createTripSchema)
  });

  const onSubmitCreateTripForm: SubmitHandler<CreateTripFormData> = async (data): Promise<void> => {
    try{
      await tripService.createTrip(data);
      console.log('Trip created');
    }catch(err){
      throw new Error('Failed to create trip in component');
    }
  };

  return (
    <div>
      <p>some</p>
      <form onSubmit={handleSubmit(onSubmitCreateTripForm)}>
        <input type={'text'} {...register('trip_name', {required: true})} placeholder={'Enter Trip name'} />
        {errors?.trip_name && <span>This field is required</span>}
        <input type={'text'} {...register('description')} placeholder={'Enter some description'} />
        <input type={'text'} {...register('date_of_trip')} placeholder={'choose the date'} />
        {errors?.date_of_trip && <span>{errors.date_of_trip.message}</span>}
        <input type={'text'} {...register('trip_picture')} placeholder={'choose the picture'} />
        {errors?.trip_picture && <span>{errors.trip_picture.message}</span>}

        <button type={'submit'}>Create trip</button>
      </form>
    </div>
  );
};

export default CreateTripComponent;