import styled from 'styled-components';


// עוטף העמוד כולו - דואג למרכז את הכרטיסייה באמצע המסך
export const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* תופס לפחות את כל גובה המסך */
  /* צבע הרקע כבר מוגדר ב-GlobalStyle, לכן אין צורך להגדיר שוב */
`;

// כרטיסיית ההתחברות/הרשמה - ה"דף" באטלס שלנו
export const AuthCard = styled.div`
  background-color: ${props => props.theme.colors.cardBg}; /* רקע לבן/נקי לכרטיס */
  border: ${props => props.theme.borders.atlas}; /* המסגרת העדינה של האטלס */
  padding: 3rem 2rem;
  width: 100%;
  max-width: 400px; /* לא נותנים לכרטיס להיות רחב מדי במסכים גדולים */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); /* צל עדין מאוד רק כדי להפריד מהרקע */
  text-align: center;
`;

// כותרת הכרטיסייה
export const Title = styled.h2`
  color: ${props => props.theme.colors.text};
  margin-bottom: 2rem;
  /* הפונט הקלאסי כבר מוגדר ב-GlobalStyle עבור תגיות h2 */
`;

// הטופס עצמו
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem; /* רווח אחיד בין כל השדות בטופס */
`;

// קבוצה של תווית ושדה קלט (כדי לסדר אותם אחד מעל השני)
export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right; /* יישור לימין לעברית */
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid ${props => props.theme.colors.border}; /* מסגרת עדינה לשדה */
  border-radius: 4px; /* פינות טיפה עגולות למראה מודרני */
  font-family: ${props => props.theme.fonts.main}; /* פונט מודרני מתוך ה-Theme */
  font-size: 1rem;
  background-color: ${props => props.theme.colors.background};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary}; /* הדגשה כחולה כשלוחצים על השדה */
  }
`;

// כפתור הפעולה המרכזי
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
    background-color: ${props => props.theme.colors.accent}; /* שינוי לצבע חותמת בעת מעבר עכבר */
  }
`;

// טקסט למעבר בין התחברות להרשמה (למשל: "אין חשבון? יצירת חשבון")
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