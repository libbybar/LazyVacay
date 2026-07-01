import styled from "styled-components";
import { ActionButton as SharedActionButton } from "./SharedUI";

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  direction: rtl;
`;


export const RoomTitle = styled.h1`
  color: ${(props) => props.theme.colors.primary};
`;

export const HotelName = styled.p`
  color: ${(props) => props.theme.colors.accent};
  font-weight: bold;
  margin-bottom: 1rem;
`;

export const RoomDetail = styled.p`
  margin-bottom: 0.5rem;
`;

export const Description = styled.p`
  margin-top: 1rem;
`;

export const ActionButton = styled(SharedActionButton)`
  margin-top: 1.5rem;
`;

