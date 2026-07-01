import styled from "styled-components";

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  direction: rtl;
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

export const PriceBox = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 6px;
  padding: 1rem;
`;


export const SuccessText = styled.p`
  text-align: center;
  font-weight: bold;
  color: ${(props) => props.theme.colors.success};
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