import styled from "styled-components";

export const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
  direction: rtl;
`;

export const PageTitle = styled.h1`
  color: ${(props) => props.theme.colors.primary};
  text-align: center;
  margin-bottom: 2rem;
`;

export const ProfileCard = styled.section`
  background-color: ${(props) => props.theme.colors.cardBg};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 6px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

export const SectionTitle = styled.h2`
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
`;

export const DetailText = styled.p`
  margin: 0;
  line-height: 1.6;
`;

export const ReservationsSection = styled.section`
  background-color: ${(props) => props.theme.colors.cardBg};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 6px;
  padding: 2rem;
  margin-bottom: 2rem;
  overflow-x: auto;
`;

export const ReservationsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th,
  td {
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
    padding: 0.9rem;
    text-align: right;
  }

  th {
    color: ${(props) => props.theme.colors.primary};
    font-weight: bold;
  }

  a {
    color: ${(props) => props.theme.colors.primary};
    font-weight: bold;
    text-decoration: none;
  }

  a:hover {
    color: ${(props) => props.theme.accent};
    text-decoration: underline;
  }
`;

export const MessageText = styled.p`
  text-align: center;
  padding: 2rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.error};
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

export const BackLink = styled.a`
  display: inline-block;
  color: ${(props) => props.theme.colors.primary};
  font-weight: bold;
  text-decoration: none;
  margin-top: 1rem;

  &:hover {
    color: ${(props) => props.theme.accent};
    text-decoration: underline;
  }
`;