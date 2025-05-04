"use client";

import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useRef, useState } from 'react';
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

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (initialData && typeof initialData.image === 'string') {
      setPreviewImage(initialData.image);
    }
  }, [initialData]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<TripStopCreateFormData | TripStopUpdateFormData>({
    resolver: zodResolver(mode === 'create' ? tripStopCreateSchema : tripStopUpdateSchema),
    defaultValues: initialData,
  })

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("image", file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const watchedFields = watch();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      if (typeof initialData.image === 'string') {
        setPreviewImage(initialData.image);
      }
    } else if (mode === 'create') {
      reset();
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [initialData, mode, reset]);

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

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              {errors?.image?.message && <span>{String(errors.image.message)}</span>}

              {previewImage && (
                <div>
                  <p>Preview:</p>
                  <img src={previewImage} alt="Preview" style={{ maxWidth: '300px', marginTop: '10px' }} />
                </div>
              )}

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
