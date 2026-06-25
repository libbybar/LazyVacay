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

export const PageTitle = styled.h1`
  color: ${(props) => props.theme.colors.primary};
  text-align: center;
  margin-bottom: 2rem;
`;

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 800px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const DashboardCard = styled.article`
  background-color: ${(props) => props.theme.colors.cardBg};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 6px;
  padding: 2rem;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const CardTitle = styled.h2`
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

export const CardText = styled.p`
  line-height: 1.6;
  margin-bottom: 1.5rem;
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
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const MessageText = styled.p`
  text-align: center;
  padding: 2rem;
  font-weight: bold;
`;