import styled from "styled-components";
import { StampCard } from './SharedUI';

export const SearchCard = styled(StampCard)`
  padding: 2.5rem 3rem; 
  margin-bottom: 3rem; 
  text-align: center;
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

export const HotelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

export const RoomDetail = styled.p`
  margin: 0.5rem 0;
  line-height: 1.5;
`;

export const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 1rem 3.5rem;
  margin-bottom: 3rem;
  border-radius: 12px;
  position: relative;

/* Background: Fine map grid lines on warm parchment gradient */
  background:
    repeating-linear-gradient(
      0deg,
      transparent 0px, transparent 39px,
      rgba(44, 62, 80, 0.06) 39px, rgba(44, 62, 80, 0.06) 40px
    ),
    repeating-linear-gradient(
      90deg,
      transparent 0px, transparent 39px,
      rgba(44, 62, 80, 0.06) 39px, rgba(44, 62, 80, 0.06) 40px
    ),
    linear-gradient(
      180deg,
      rgba(244, 236, 224, 0.55) 0%,
      rgba(253, 251, 247, 0) 100%
    );

  border: 1px solid rgba(209, 199, 189, 0.7);
  box-shadow: 0 4px 24px rgba(44, 62, 80, 0.05), inset 0 0 80px rgba(244, 236, 224, 0.3);

/* Inner frame — Atlas page effect */
  &::before {
    content: '';
    position: absolute;
    inset: 10px;
    border: 1px solid rgba(209, 199, 189, 0.45);
    border-radius: 8px;
    pointer-events: none;
  }

/* Mark center coordinates at the bottom */
  &::after {
    content: '✦';
    position: absolute;
    bottom: -0.65rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.85rem;
    color: ${(props) => props.theme.colors.border};
    background-color: ${(props) => props.theme.colors.background};
    padding: 0 0.6rem;
    font-family: ${(props) => props.theme.fonts.coords};
    line-height: 1;
  }
`;

export const MainHeadline = styled.h1`
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 3.5rem;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 1rem;
  letter-spacing: -0.5px;
  text-shadow: 0 1px 3px rgba(26, 54, 93, 0.12);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const SubHeadline = styled.p`
  font-family: ${(props) => props.theme.fonts.main};
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.accent};
  font-style: italic;
  letter-spacing: 0.05em;
`;