import * as Dialog from '@radix-ui/react-dialog';
import styles from './PinModal.module.css'
interface IProps{
  open: boolean;
  onOpenChangeAction: (val: boolean) => void;
  handleDeleteUser: () => void;
}
export default function DeleteUserModal({open, onOpenChangeAction, handleDeleteUser}: IProps) {

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChangeAction}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.modalOverlay} />
        <Dialog.Content className={styles.modalContent} >
          <Dialog.Title className={styles.modalTitle} >Delete your account</Dialog.Title>
          <Dialog.Description className={styles.modalDescription}>
            Are you sure you want to delete your account? This action cannot be undone.
          </Dialog.Description>

          <button className={styles.modalAvatarButton} onClick={handleDeleteUser}>Delete me</button>
          <Dialog.Close className={styles.modalAvatarButton}>Close</Dialog.Close>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

