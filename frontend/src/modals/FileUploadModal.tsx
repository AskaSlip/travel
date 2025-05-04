import * as Dialog from '@radix-ui/react-dialog';
import styles from './PinModal.module.css'
interface IProps{
  open: boolean;
  onOpenChangeAction: (val: boolean) => void;
  handleChangeAvatar: () => void;
  textAreas: {
    title: string;
    button: string;
  };
}
export default function FileUploadModal({open, onOpenChangeAction, handleChangeAvatar, textAreas}: IProps) {

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChangeAction}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.modalOverlay} />
        <Dialog.Content className={styles.modalContent} >
          <Dialog.Title className={styles.modalTitle} >{textAreas.title}</Dialog.Title>

          <button className={styles.modalAvatarButton} onClick={handleChangeAvatar}>{textAreas.button}</button>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

//todo винести стилі для модалок в окремий файл