import {
  FormCard,
  FormGrid,
  InputGroup,
  Label,
  Input,
  TextArea,
  ActionButton,
  SecondaryButton,
  ButtonsRow,
} from "../../styles/AdminPagesStyle";

import { UI_TEXT } from "../../constants/uiText";

const HotelForm = ({
  hotel,
  onChange,
  onSubmit,
  onCancel,
  submitText,
  isLoading = false,
}) => {
  return (
    <FormCard onSubmit={onSubmit}>
      <FormGrid>
        <InputGroup>
          <Label>{UI_TEXT.HOTEL_NAME}</Label>

          <Input
            type="text"
            name="name"
            value={hotel.name}
            onChange={onChange}
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>{UI_TEXT.COUNTRY_LABEL}</Label>

          <Input
            type="text"
            name="country"
            value={hotel.country}
            onChange={onChange}
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>{UI_TEXT.CITY_LABEL}</Label>

          <Input
            type="text"
            name="city"
            value={hotel.city}
            onChange={onChange}
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>{UI_TEXT.STARS}</Label>

          <Input
            type="number"
            name="stars"
            min="1"
            max="5"
            value={hotel.stars}
            onChange={onChange}
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>{UI_TEXT.IMAGE_URL}</Label>

          <Input
            type="text"
            name="imageUrl"
            value={hotel.imageUrl}
            onChange={onChange}
          />
        </InputGroup>
      </FormGrid>

      <InputGroup>
        <Label>{UI_TEXT.DESCRIPTION_LABEL}</Label>

        <TextArea
          name="description"
          value={hotel.description}
          onChange={onChange}
        />
      </InputGroup>

      <ButtonsRow>
        <SecondaryButton
          type="button"
          onClick={onCancel}
          disabled={isLoading}
        >
          {UI_TEXT.CANCEL}
        </SecondaryButton>

        <ActionButton type="submit" disabled={isLoading}>
          {submitText}
        </ActionButton>
      </ButtonsRow>
    </FormCard>
  );
};

export default HotelForm;