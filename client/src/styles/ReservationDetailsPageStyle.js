import styled from "styled-components";
import { ActionButton as SharedActionButton } from "./SharedUI";

export const Container = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 2rem;
  direction: rtl;
`;

export const ConfirmationSubtitle = styled.p`
  text-align: center;
  color: ${(props) => props.theme.colors.accent};
  font-style: italic;
  font-size: 1.05rem;
  margin-top: -0.5rem;
  margin-bottom: 1.75rem;
  letter-spacing: 0.03em;
`;

export const SectionDivider = styled.img`
  width: 100%;
  height: auto;
  display: block;
  opacity: 0.4;
  margin: 1.5rem 0;
`;

export const UserBlock = styled.section`
  text-align: center;
  margin-bottom: 0.5rem;
`;

export const UserName = styled.h1`
  margin-bottom: 0.25rem;
  color: ${(props) => props.theme.colors.primary};
  font-size: 1.9rem;
`;

export const UserEmail = styled.p`
  color: ${(props) => props.theme.colors.accent};
  font-weight: bold;
`;

export const DetailsBlock = styled.section`
  text-align: center;
`;

export const DetailText = styled.p`
  margin-bottom: 0.75rem;
  font-size: 1rem;
`;

export const PriceBox = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 6px;
  padding: 0.85rem 1.5rem;
  margin-top: 1.25rem;
  display: inline-block;
`;

export const PriceText = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
  margin: 0;
`;

export const ActionButton = styled(SharedActionButton)`
  margin-top: 0.5rem;
  display: block;
  margin-inline: auto;
`;
