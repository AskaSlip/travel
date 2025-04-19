"use client";

import * as Dialog from '@radix-ui/react-dialog';
import { useEffect} from 'react';
import styles from './PinModal.module.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TripStopCreateFormData,
  tripStopCreateSchema,
  TripStopUpdateFormData,
  tripStopUpdateSchema,
} from '@/validator/validation';

type Mode = 'create' | 'edit';

interface IProps {
  initialData?: TripStopCreateFormData | TripStopUpdateFormData;
  onSaveAction: (data: TripStopCreateFormData | TripStopUpdateFormData) => void;
  onDeleteAction: () => void;
  open: boolean;
  onOpenChangeAction: (val: boolean) => void;
  textAreas: {
    title: string;
    description: string;
    saveBtn: string;
    deleteBtn: string;
  };
  mode: Mode;
}

export default function PinModal({ initialData, onSaveAction, onDeleteAction, open, onOpenChangeAction, textAreas, mode }: IProps) {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<TripStopCreateFormData | TripStopUpdateFormData>({
    resolver: zodResolver(mode === 'create' ? tripStopCreateSchema : tripStopUpdateSchema),
    defaultValues: initialData,
  })

  const watchedFields = watch();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: TripStopCreateFormData | TripStopUpdateFormData) => {
    onSaveAction(data);
    reset();
  };

  const isFormChanged = Object.keys(watchedFields).some((key) => {
   return watchedFields[key as keyof TripStopCreateFormData | keyof TripStopUpdateFormData] !== initialData?.[key as keyof TripStopCreateFormData | keyof TripStopUpdateFormData];
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChangeAction}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.modalOverlay} />
        <Dialog.Content className={styles.modalContent}>
          <Dialog.Title className={styles.modalTitle}>{textAreas.title}</Dialog.Title>
          <Dialog.Description className={styles.modalDescription}>
            {textAreas.description}
          </Dialog.Description>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <label>
              Title:
              <input {...register('key')} />
              {errors.key && <span>{errors.key.message}</span>}
            </label>
            <label>
              Notes:
              <textarea {...register('notes')} />
              {errors.notes && <span>{errors.notes.message}</span>}
            </label>
            <label>
              Image:
              <input {...register('image')} />
              {errors.image && <span>{errors.image.message}</span>}
            </label>
          <div className={styles.modalButtons}>
            <button type={'submit'}  disabled={!isFormChanged}>
              {textAreas.saveBtn}
            </button>
            <button type="button" onClick={onDeleteAction}>{textAreas.deleteBtn}</button>
            <Dialog.Close>Close</Dialog.Close>
          </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
