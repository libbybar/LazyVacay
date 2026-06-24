import styled from "styled-components";

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  direction: rtl;
`;

export const BackButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.primary};
  font-family: ${(props) => props.theme.fonts.main};
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 1.5rem;
`;

export const BookingCard = styled.article`
  background-color: ${(props) => props.theme.colors.cardBg};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 6px;
  padding: 2rem;
`;

export const PageTitle = styled.h1`
  color: ${(props) => props.theme.colors.primary};
`;

export const RoomName = styled.h2`
  margin-bottom: 0.5rem;
`;

export const DetailText = styled.p`
  margin-bottom: 0.5rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-top: 1.5rem;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-weight: bold;
`;

export const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
  font-family: ${(props) => props.theme.fonts.main};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const PriceBox = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 6px;
  padding: 1rem;
`;

export const ActionButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.9rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  font-family: ${(props) => props.theme.fonts.main};

  &:hover {
    background-color: ${(props) => props.theme.accent};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  background-color: transparent;
  color: ${(props) => props.theme.colors.primary};
  border: 1px solid ${(props) => props.theme.colors.primary};
  padding: 0.9rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  font-family: ${(props) => props.theme.fonts.main};

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const MessageText = styled.p`
  text-align: center;
  font-weight: bold;
  color: ${(props) => props.theme.colors.error};
`;

export const SuccessText = styled.p`
  text-align: center;
  font-weight: bold;
  color: ${(props) => props.theme.success};
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;
`;

export const ModalCard = styled.article`
  width: 100%;
  max-width: 520px;
  background-color: ${(props) => props.theme.colors.cardBg};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 8px;
  padding: 2rem;
  direction: rtl;
`;

export const ModalTitle = styled.h2`
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

export const ModalSubtitle = styled.p`
  margin-bottom: 1.5rem;
`;

export const ModalDetails = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-start;

  @media (max-width: 520px) {
    flex-direction: column;
  }
`;