import styled from "styled-components";

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
  color: ${(props) => props.theme.colors.accent};
  font-weight: bold;
`;

export const StarsText = styled.p`
  margin: 0.5rem 0;
`;

export const Description = styled.p`
  margin-top: 0.75rem;
`;

export const RoomsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

export const RoomTitle = styled.h3`
  color: ${(props) => props.theme.colors.primary};
`;

export const RoomDetail = styled.p`
  margin-bottom: 0.35rem;
`;

