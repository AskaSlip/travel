import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import styles from './PinModal.module.css';
import { useForm } from 'react-hook-form';
import { ITicket } from '@/models/ITicket';

interface IProps {
  open: boolean;
  onOpenChangeAction: (val: boolean) => void;
  handleSaveTicketAction: (data: ITicket) => void;
  handleUploadFileAction: (file: File) => void;
}

export default function CreateTicketModal({
                                            open,
                                            onOpenChangeAction,
                                            handleUploadFileAction,
                                            handleSaveTicketAction,
                                          }: IProps) {
  const { register, handleSubmit } = useForm<ITicket>();
  const [file, setFile] = useState<File | null>(null);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleUploadFileAction(selectedFile);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChangeAction}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.modalOverlay} />
        <Dialog.Content className={styles.modalContent}>
          <Dialog.Title className={styles.modalTitle}>Add your ticket</Dialog.Title>
          <form onSubmit={handleSubmit(handleSaveTicketAction)}>
            <label>
              Name your ticket:
              <input type="text" {...register('name')} />
            </label>

            <input
              type="file"
              id="file-input"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <button
              type="button"
              className={styles.modalAvatarButton}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              Upload ticket
            </button>

            <div className={styles.modalButtons}>
              <button type="submit" className={styles.modalAvatarButton}>
                Save ticket
              </button>
              <Dialog.Close>Close</Dialog.Close>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
