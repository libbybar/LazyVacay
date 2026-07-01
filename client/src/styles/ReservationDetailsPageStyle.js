import styled from "styled-components";
import { ActionButton as SharedActionButton } from "./SharedUI";

export const Container = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 2rem;
  direction: rtl;
`;

export const UserBlock = styled.section`
  text-align: center;
  margin-bottom: 2rem;
`;

export const UserName = styled.h2`
  margin-bottom: 0.25rem;
`;

export const UserEmail = styled.p`
  color: ${(props) => props.theme.colors.accent};
  font-weight: bold;
`;

export const DetailsBlock = styled.section`
  border-top: 1px solid ${(props) => props.theme.colors.border};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  padding: 1.5rem 0;
`;

export const DetailText = styled.p`
  margin-bottom: 0.75rem;
  font-size: 1rem;
`;

export const PriceText = styled.p`
  margin-top: 1.25rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
`;

export const ActionButton = styled(SharedActionButton)`
  margin-top: 2rem;
`;

