import styled from 'styled-components';

export const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
  align-items: flex-start;
  padding-top: 6rem;
  
  
  background-image: 
  linear-gradient(rgba(249, 248, 246, 0), rgba(249, 248, 246, 0.85)),
  url('/images/Sunset.png'); 
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
`;

export const AuthCard = styled.div`
  background-color: ${props => props.theme.colors.cardBg};
  width: 100%;
  max-width: 400px;
  text-align: center;
  
  height: 580px; 
  display: flex;
  flex-direction: column;
  justify-content: center;

  /* הגדלנו את השוליים הפנימיים מ-2.5rem ל-3.5rem כדי לתת המון "אוויר" למעלה ולמטה */
  padding: 3.5rem 2.5rem; 
  border: 4px double ${props => props.theme.colors.border};
  border-radius: 4px;
  position: relative; 
  box-shadow: 0 10px 30px rgba(44, 62, 80, 0.1); 

  &::before {
    content: '';
    position: absolute;
    top: -10px; left: -10px; right: -10px; bottom: -10px;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 6px;
    z-index: -1;
    background-color: ${props => props.theme.colors.cardBg}; 
  }
`;

export const Title = styled.h2`
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.2rem; 
`;

export const Subtitle = styled.p`
  color: ${props => props.theme.accent}; 
  font-family: ${props => props.theme.fonts.main};
  font-style: italic; 
  margin-bottom: 1.2rem; /* במקום 2rem קודם */
  font-size: 1.05rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* הקטנו משמעותית את הרווח בין כל שדה כדי לפנות מקום לשוליים */
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right; 
  gap: 0.2rem; 
`;

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const Input = styled.input`

  padding: 0.6rem 0.8rem; 
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-family: ${props => props.theme.fonts.main};
  font-size: 1rem;
  background-color: ${props => props.theme.colors.background};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const SubmitButton = styled.button`
  margin-top: 1rem;
  padding: 0.8rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  font-family: ${props => props.theme.fonts.main};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.accent};
  }
`;

export const ToggleModeText = styled.p`
  margin-top: 1.5rem;
  font-size: 0.9rem;
  
  span {
    color: ${props => props.theme.colors.primary};
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
    
    &:hover {
      color: ${props => props.theme.colors.accent};
    }
  }
`;