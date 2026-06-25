import {
  FormCard,
  FormGrid,
  InputGroup,
  Label,
  Input,
  TextArea,
  ActionButton,
  SecondaryButton,
  DeleteButton,
  ButtonsRow,
  SectionTitle,
} from "../../styles/AdminPagesStyle";

import { UI_TEXT } from "../../constants/uiText";

const RoomForm = ({
  room,
  roomIndex,
  onChange,
  onSubmit,
  onCancel,
  onRemove,
  submitText,
  isLoading = false,
  canRemove = false,
}) => {
  return (
    <FormCard onSubmit={onSubmit}>
      <SectionTitle>
        {room.name || `${UI_TEXT.ROOM_NAME} ${roomIndex + 1}`}
      </SectionTitle>

      <FormGrid>
        <InputGroup>
          <Label>{UI_TEXT.ROOM_NAME}</Label>
          <Input type="text" name="name" value={room.name} onChange={onChange} required />
        </InputGroup>

        <InputGroup>
          <Label>{UI_TEXT.ROOM_SIZE}</Label>
          <Input type="number" name="size" min="1" value={room.size} onChange={onChange} required />
        </InputGroup>

        <InputGroup>
          <Label>{UI_TEXT.MAX_GUESTS}</Label>
          <Input type="number" name="maxGuests" min="1" value={room.maxGuests} onChange={onChange} required />
        </InputGroup>

        <InputGroup>
          <Label>{UI_TEXT.PRICE}</Label>
          <Input type="number" name="price" min="1" value={room.price} onChange={onChange} required />
        </InputGroup>

        <InputGroup>
          <Label>{UI_TEXT.IMAGE_URL}</Label>
          <Input type="text" name="imageUrl" value={room.imageUrl} onChange={onChange} />
        </InputGroup>
      </FormGrid>

      <InputGroup>
        <Label>{UI_TEXT.DESCRIPTION}</Label>
        <TextArea name="description" value={room.description} onChange={onChange} />
      </InputGroup>

      <ButtonsRow>
        {canRemove && (
          <DeleteButton type="button" onClick={onRemove} disabled={isLoading}>
            {UI_TEXT.ADMIN_REMOVE_ROOM_ROW}
          </DeleteButton>
        )}

        {onCancel && (
          <SecondaryButton type="button" onClick={onCancel} disabled={isLoading}>
            {UI_TEXT.CANCEL}
          </SecondaryButton>
        )}

        {submitText && (
          <ActionButton type="submit" disabled={isLoading}>
            {submitText}
          </ActionButton>
        )}
      </ButtonsRow>
    </FormCard>
  );
};

export default RoomForm;