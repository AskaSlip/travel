'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { ITrip } from '@/models/ITrip';
import { tripService } from '@/services/api.services';
//todo add calender to choose date
//todo add photo upload
const CreateTripComponent = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ITrip>();

  const onSubmitCreateTripForm: SubmitHandler<ITrip> = async (data): Promise<void> => {
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
        <input type={'text'} {...register('trip_picture')} placeholder={'choose the picture'} />

        <button type={'submit'}>Create trip</button>
      </form>
    </div>
  );
};

export default CreateTripComponent;