import styled from "styled-components";

export const Container = styled.div`
  max-width: 1100px;
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

export const HotelHeader = styled.section`
  background-color: ${(props) => props.theme.colors.cardBg};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 6px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

export const HotelTitle = styled.h1`
  color: ${(props) => props.theme.colors.primary};
`;

export const HotelLocation = styled.p`
  color: ${(props) => props.theme.accent};
  font-weight: bold;
`;

export const StarsText = styled.p`
  margin: 0.5rem 0;
`;

export const Description = styled.p`
  margin-top: 0.75rem;
`;

export const SectionTitle = styled.h2`
  margin-bottom: 1.5rem;
`;

export const RoomsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

export const RoomCard = styled.article`
  background-color: ${(props) => props.theme.colors.cardBg};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 6px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const RoomTitle = styled.h3`
  color: ${(props) => props.theme.colors.primary};
`;

export const RoomDetail = styled.p`
  margin-bottom: 0.35rem;
`;

export const ActionButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.8rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1.5rem;
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