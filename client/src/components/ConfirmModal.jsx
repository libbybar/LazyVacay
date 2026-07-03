import { ActionButton, SecondaryButton, ModalOverlay } from "../styles/SharedUI";
import { UI_TEXT } from "../constants/uiText";
import {
  ModalCard,
  ModalTitle,
  ModalMessage,
  ModalButtonsRow,
} from "../styles/ConfirmModalStyle";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalOverlay>
      <ModalCard>
        <ModalTitle>{title}</ModalTitle>

        <ModalMessage>{message}</ModalMessage>

        <ModalButtonsRow>
          <SecondaryButton type="button" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </SecondaryButton>

          <ActionButton type="button" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? UI_TEXT.SAVING_IN_PROGRESS : confirmText}
          </ActionButton>
        </ModalButtonsRow>
      </ModalCard>
    </ModalOverlay>
  );
};

export default ConfirmModal;