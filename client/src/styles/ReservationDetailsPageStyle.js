import styled from "styled-components";

export const Container = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 2rem;
  direction: rtl;
`;

export const ConfirmationCard = styled.article`
  background-color: ${(props) => props.theme.colors.cardBg};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 6px;
  padding: 2rem;
`;

export const PageTitle = styled.h1`
  color: ${(props) => props.theme.colors.primary};
  text-align: center;
  margin-bottom: 2rem;
`;

export const UserBlock = styled.section`
  text-align: center;
  margin-bottom: 2rem;
`;

export const UserName = styled.h2`
  margin-bottom: 0.25rem;
`;

export const UserEmail = styled.p`
  color: ${(props) => props.theme.accent};
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

export const ActionButton = styled.button`
  width: 100%;
  margin-top: 2rem;
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