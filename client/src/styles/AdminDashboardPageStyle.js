import styled from "styled-components";

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
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
  align-items: center;
  text-align: center;
`;

export const CardText = styled.p`
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

