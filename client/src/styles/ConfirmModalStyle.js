import styled from "styled-components";

export const ModalCard = styled.div`
  width: 100%;
  max-width: 420px;
  background-color: ${(props) => props.theme.colors.cardBg};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 6px;
  padding: 2rem;
  direction: rtl;
`;

export const ModalTitle = styled.h2`
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

export const ModalMessage = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

export const ModalButtonsRow = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

