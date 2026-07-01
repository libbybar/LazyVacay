import styled from "styled-components";
import { StampCard } from './SharedUI';

export const ProfileCard = styled(StampCard)`
  margin-bottom: 2rem;
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
    color: ${(props) => props.theme.colors.accent};
    text-decoration: underline;
  }
`;

export const ProfileFormActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
`;

export const BackLink = styled.a`
  display: inline-block;
  color: ${(props) => props.theme.colors.primary};
  font-weight: bold;
  text-decoration: none;
  margin-top: 1rem;

  &:hover {
    color: ${(props) => props.theme.colors.accent};
    text-decoration: underline;
  }
`;