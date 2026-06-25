import {
  ModalOverlay,
  ModalCard,
  ModalTitle,
  ModalMessage,
  ModalButtonsRow,
  ConfirmButton,
  CancelButton,
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
          <CancelButton type="button" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </CancelButton>

          <ConfirmButton type="button" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "שומרת..." : confirmText}
          </ConfirmButton>
        </ModalButtonsRow>
      </ModalCard>
    </ModalOverlay>
  );
};

export default ConfirmModal;