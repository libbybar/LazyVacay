import styled from "styled-components";
import { ActionButton, SecondaryButton, InputGroup, Label, Input, TopBar, SectionTitle } from "./SharedUI";
export { ActionButton, SecondaryButton, InputGroup, Label, Input, TopBar, SectionTitle };

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  direction: rtl;
`;

export const ManagementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

export const ManagementCard = styled.article`
  background-color: ${(props) => props.theme.colors.cardBg};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 6px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const DetailsCard = styled.section`
  background-color: ${(props) => props.theme.colors.cardBg};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 6px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

export const DetailText = styled.p`
  margin: 0.5rem 0;
  line-height: 1.5;
`;

export const ButtonsRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;



export const DeleteButton = styled.button`
  background-color: ${(props) => props.theme.colors.error};
  color: white;
  border: none;
  padding: 0.8rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  font-family: ${(props) => props.theme.fonts.main};

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ManagementTable = styled.table`
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
`;

export const FormCard = styled.form`
  background-color: ${(props) => props.theme.colors.cardBg};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 6px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
`;

export const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
  font-family: ${(props) => props.theme.fonts.main};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
  font-family: ${(props) => props.theme.fonts.main};
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

