import styled from "styled-components";

export const HotelHeader = styled.section`
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 0;
`;

export const HotelHeroImage = styled.img`
  width: 100%;
  height: 555px;
  object-fit: cover;
  display: block;

  -webkit-mask-image:
    linear-gradient(to bottom, transparent 0%, black 8%, black 78%, transparent 100%),
    linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%);
  -webkit-mask-composite: source-in;
  mask-image:
    linear-gradient(to bottom, transparent 0%, black 8%, black 78%, transparent 100%),
    linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%);
  mask-composite: intersect;

  @media (max-width: 600px) {
    height: 340px;
  }
`;

export const HeroOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20%;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(253, 251, 247, 0.5) 55%,
    rgba(253, 251, 247, 0.93) 80%,
    ${(props) => props.theme.colors.background} 100%
  );
`;

export const HeroCaption = styled.div`
  text-align: center;
  direction: rtl;
  padding: 0.75rem 2rem 1.25rem;
`;

export const HeroContent = styled.div`
  padding: 2rem;
  background-color: ${(props) => props.theme.colors.cardBg};
  direction: rtl;
  text-align: right;
`;

export const HotelTitle = styled.h1`
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 0.35rem;
`;

export const HotelLocation = styled.p`
  color: ${(props) => props.theme.colors.accent};
  font-weight: bold;
`;

export const StarsText = styled.p`
  margin: 0.5rem 0;
  font-family: ${(props) => props.theme.fonts.heading};
  color: ${(props) => props.theme.colors.primary};
  letter-spacing: 0.12em;
`;

export const Description = styled.p`
  margin-top: 0;
  margin-bottom: 2rem;
  white-space: pre-line;
`;

export const RoomsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const RoomRowDivider = styled.img`
  width: 100%;
  height: auto;
  display: block;
  opacity: 0.4;
`;

export const RoomRow = styled.article`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  background-color: ${(props) => props.theme.colors.cardBg};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow 0.3s ease-out;

  &:hover {
    box-shadow: 0 4px 16px rgba(44, 62, 80, 0.12);
  }

  &:hover > img {
    transform: scale(1.03);
  }

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export const RoomRowImage = styled.img`
  width: 220px;
  min-width: 220px;
  object-fit: cover;
  display: block;
  transition: transform 0.35s ease-out;

  -webkit-mask-image:
    linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%),
    linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
  -webkit-mask-composite: source-in;
  mask-image:
    linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%),
    linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
  mask-composite: intersect;

  @media (max-width: 600px) {
    width: 100%;
    min-width: unset;
    height: 180px;
  }
`;

export const RoomZoneDivider = styled.div`
  width: 32px;
  flex-shrink: 0;
  align-self: center;
  height: 70px;
  overflow: hidden;
  position: relative;

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 560px;
    height: 32px;
    transform: translate(-50%, -50%) rotate(${(props) => props.$rotate ?? 90}deg);
    opacity: 0.4;
  }

  @media (max-width: 600px) {
    display: none;
  }
`;

export const RoomRowText = styled.div`
  flex: 1.2;
  min-width: 150px;
  padding: 0.75rem 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  direction: rtl;
  text-align: right;
  gap: 0.25rem;
`;

export const RoomRowStats = styled.div`
  display: flex;
  flex-direction: row;
  direction: rtl;

  @media (max-width: 600px) {
    border-top: ${(props) => props.theme.borders.atlas};
  }
`;

export const RoomStatColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 0.75rem;
  text-align: center;
  gap: 0.3rem;
`;

export const RoomStatLabel = styled.span`
  font-size: 0.68rem;
  color: ${(props) => props.theme.colors.accent};
  letter-spacing: 0.05em;
`;

export const RoomStatIcon = styled.img`
  width: 22px;
  height: 22px;
  display: block;
  filter: brightness(0) saturate(100%) invert(17%) sepia(53%) saturate(800%) hue-rotate(193deg) brightness(90%) contrast(96%);
`;

export const RoomStatValue = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
`;

export const RoomRowActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  flex-shrink: 0;

  @media (max-width: 600px) {
    border-top: ${(props) => props.theme.borders.atlas};
    padding: 1rem 1.5rem;
  }
`;

export const RoomAccessibilityIcon = styled.img`
  width: 32px;
  height: 32px;
  display: block;
  filter: brightness(0) saturate(100%) invert(17%) sepia(53%) saturate(800%) hue-rotate(193deg) brightness(90%) contrast(96%);
`;

export const RoomTitle = styled.h3`
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 0;
`;

export const RoomDetail = styled.p`
  margin-bottom: 0.35rem;
`;

