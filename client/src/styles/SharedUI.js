import styled, { keyframes } from "styled-components";

// ==========================================
// 1. Layout & Typography (RTL)
// ==========================================

export const Container = styled.div`
  max-width: 1150px;
  margin: 0 auto;
  padding: 2rem;
  direction: rtl;
  text-align: right;
`;

export const PageTitle = styled.h1`
  text-align: center;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 2rem;
  font-family: ${(props) => props.theme.fonts.heading};
`;

export const MessageText = styled.p`
  text-align: center;
  font-weight: bold;
  color: ${(props) => props.theme.colors.text};
  padding: 2rem;
`;


export const ErrorText = styled.p`
  text-align: center;
  font-weight: bold;
  color: ${(props) => props.theme.colors.error};
  margin-bottom: 1.5rem;
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

export const SectionTitle = styled.h2`
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 1rem;
`;


export const TableCard = styled.section`
  background-color: ${(props) => props.theme.colors.cardBg};
  border: 4px double ${(props) => props.theme.colors.border};
  border-radius: 4px;
  padding: 2rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  box-shadow: 0 4px 20px rgba(44, 62, 80, 0.06);
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(44, 42, 40, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;
`;

// ==========================================
// 2. The Cards (The "Atlas" Core)
// ==========================================

export const AtlasCard = styled.article`
  background-color: ${(props) => props.theme.colors.cardBg};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  box-shadow: 0 4px 16px rgba(44, 62, 80, 0.08);
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 28px rgba(44, 62, 80, 0.22);
  }

  img {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border-bottom: ${(props) => props.theme.borders.atlas};
    display: block;
    transition: transform 0.35s ease-out;
    mask-image: linear-gradient(to bottom, black 92%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, black 92%, transparent 100%);
  }

  &:hover img {
    transform: scale(1.03);
  }

  > div {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    flex-grow: 1;
    background-color: ${(props) => props.theme.colors.cardBg};
    z-index: 1;
  }

  > button {
    margin: 0 1.5rem 1.5rem;
  }
`;

export const DetailCard = styled.article`
  background-color: ${(props) => props.theme.colors.cardBg};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(44, 62, 80, 0.06);
`;

export const StampCard = styled.div`
  background-color: ${(props) => props.theme.colors.cardBg};
  border: 4px double ${(props) => props.theme.colors.border};
  border-radius: 4px;
  position: relative; 
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(44, 62, 80, 0.08);

  &::before {
    content: '';
    position: absolute;
    top: -10px; left: -10px; right: -10px; bottom: -10px;
    border: 1px solid ${(props) => props.theme.colors.border};
    border-radius: 6px;
    z-index: -1;
    background-color: ${(props) => props.theme.colors.cardBg}; 
  }
`;

// ==========================================
// 3. Buttons (New & Improved)
// ==========================================

export const BackButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.primary};
  font-family: ${(props) => props.theme.fonts.main};
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;

  &:hover {
    color: ${(props) => props.theme.colors.accent};
  }
`;

export const ActionButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.8rem 1.8rem;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.04em;
  border-radius: ${(props) => props.theme.radius.button};
  cursor: pointer;
  font-family: ${(props) => props.theme.fonts.main};
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.accent};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled(ActionButton)`
  background-color: transparent;
  color: ${(props) => props.theme.colors.primary};
  border: 1px solid ${(props) => props.theme.colors.primary};
  box-shadow: none;

  &:hover {
    background-color: transparent;
    color: ${(props) => props.theme.colors.accent};
    border-color: ${(props) => props.theme.colors.accent};
    box-shadow: none;
  }
`;

export const SignatureButton = styled.button`
  position: relative;
  isolation: isolate;
  overflow: hidden;

  background:
    radial-gradient(
      circle at 35% 25%,
      rgba(255, 235, 210, 0.18) 0%,
      rgba(255, 235, 210, 0.08) 18%,
      transparent 42%
    ),
    linear-gradient(
      145deg,
      ${(props) => props.theme.colors.waxSeal} 0%,
      ${(props) => props.theme.colors.waxSealDark} 100%
    );

  color: ${(props) => props.theme.colors.waxSealText};
  border: 1px solid rgba(93, 0, 0, 0.35);
  padding: 0.85rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.04em;
  border-radius: ${(props) => props.theme.radius.button};
  cursor: pointer;
  font-family: ${(props) => props.theme.fonts.main};

  box-shadow:
    inset 0 1px 0 rgba(255, 245, 225, 0.24),
    inset 0 -3px 7px rgba(60, 0, 0, 0.28),
    0 5px 14px rgba(93, 0, 0, 0.26);

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    filter 0.18s ease;

  &::after {
    content: "";
    position: absolute;
    inset: 5px 9px;
    border-radius: inherit;
    border: 1px solid rgba(255, 235, 210, 0.18);
    pointer-events: none;
    z-index: -1;
  }

  &:hover {
    transform: translateY(-2px);
    filter: saturate(1.08) contrast(1.04);
    box-shadow:
      inset 0 1px 0 rgba(255, 245, 225, 0.28),
      inset 0 -3px 8px rgba(60, 0, 0, 0.34),
      0 8px 18px rgba(93, 0, 0, 0.34);
  }

  &:active {
    transform: translateY(0);
    box-shadow:
      inset 0 2px 5px rgba(60, 0, 0, 0.35),
      0 3px 9px rgba(93, 0, 0, 0.25);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    filter: grayscale(0.2);
  }
`;


export const WaxSealButton = styled.button`
  background-color: ${(props) => props.theme.colors.waxSeal};
  color: ${(props) => props.theme.colors.waxSealText};
  border: none;
  width: 75px;
  height: 75px;
  border-radius: 48% 52% 50% 50% / 51% 48% 52% 49%;
  font-family: ${(props) => props.theme.fonts.handwritten};
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.3), inset 2px 2px 4px rgba(255,255,255,0.1);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1) rotate(8deg);
    background-color: ${(props) => props.theme.colors.waxSealDark};
  }
`;

// ==========================================
// 4. Forms
// ==========================================

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  font-weight: bold;
  font-size: 0.95rem;
  color: ${(props) => props.theme.colors.primary};
`;

export const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 6px;
  font-family: ${(props) => props.theme.fonts.main};
  font-size: 1rem;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  direction: rtl;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

// ==========================================
// 5. Page Transitions
// ==========================================

const pageEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const PageTransition = styled.div`
  animation: ${pageEnter} 300ms ease-out both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const StarRating = styled.span`
  font-family: ${(props) => props.theme.fonts.heading};
  color: ${(props) => props.theme.colors.primary};
  letter-spacing: 0.12em;
  font-size: 1rem;
`;

export const LocationIcon = styled.img`
  width: 14px;
  height: 14px;
  vertical-align: middle;
  margin-inline-end: 0.25rem;
  filter: brightness(0) saturate(100%) invert(17%) sepia(53%) saturate(800%) hue-rotate(193deg) brightness(90%) contrast(96%);
`;