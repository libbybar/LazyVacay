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

export const RoomCard = styled.article`
  background-color: ${(props) => props.theme.colors.cardBg};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 6px;
  padding: 2rem;
`;

export const RoomTitle = styled.h1`
  color: ${(props) => props.theme.colors.primary};
`;

export const HotelName = styled.p`
  color: ${(props) => props.theme.accent};
  font-weight: bold;
  margin-bottom: 1rem;
`;

export const RoomDetail = styled.p`
  margin-bottom: 0.5rem;
`;

export const Description = styled.p`
  margin-top: 1rem;
`;

export const ActionButton = styled.button`
  width: 100%;
  margin-top: 1.5rem;
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
`;

export const MessageText = styled.p`
  text-align: center;
  padding: 2rem;
  font-weight: bold;
`;