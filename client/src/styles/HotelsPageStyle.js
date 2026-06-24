import styled from "styled-components";

export const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  direction: rtl;
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export const PageTitle = styled.h1`
  text-align: center;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 2rem;
`;

export const SearchCard = styled.section`
  background-color: ${(props) => props.theme.colors.cardBg};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 6px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

export const SearchTitle = styled.h2`
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

export const SearchSubtitle = styled.p`
  margin-bottom: 1.5rem;
`;

export const SearchForm = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  align-items: end;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-weight: bold;
`;

export const Input = styled.input`
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

export const HotelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

export const HotelCard = styled.article`
  background-color: ${(props) => props.theme.colors.cardBg};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 6px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const RoomDetail = styled.p`
  margin: 0.5rem 0;
  line-height: 1.5;
`;

export const ActionButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.8rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  font-family: ${(props) => props.theme.fonts.main};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.accent};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  background-color: transparent;
  color: ${(props) => props.theme.colors.primary};
  border: 1px solid ${(props) => props.theme.colors.primary};
  padding: 0.8rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  font-family: ${(props) => props.theme.fonts.main};

  &:hover {
    color: ${(props) => props.theme.accent};
    border-color: ${(props) => props.theme.accent};
  }
`;

export const MessageText = styled.p`
  text-align: center;
  font-weight: bold;
  color: ${(props) => props.theme.colors.error};
  margin-bottom: 1.5rem;
`;