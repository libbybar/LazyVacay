import styled from "styled-components";
import { ActionButton as SharedActionButton } from "./SharedUI";

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  direction: rtl;
`;

export const RoomHeroImage = styled.img`
  width: 100%;
  max-height: 300px;
  aspect-ratio: 21 / 9;
  object-fit: cover;
  display: block;

  -webkit-mask-image:
    linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%),
    linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
  -webkit-mask-composite: source-in;
  mask-image:
    linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%),
    linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
  mask-composite: intersect;
`;

export const RoomTitle = styled.h1`
  color: ${(props) => props.theme.colors.primary};
  text-align: center;
`;

export const HotelName = styled.p`
  color: ${(props) => props.theme.colors.accent};
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
`;

export const StatsRow = styled.div`
  display: flex;
  flex-direction: row;
  direction: rtl;
  margin: 1.25rem 0;
  border-top: ${(props) => props.theme.borders.atlas};
  border-bottom: ${(props) => props.theme.borders.atlas};
`;

export const StatZoneDivider = styled.div`
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
    transform: translate(-50%, -50%) rotate(90deg);
    opacity: 0.4;
  }
`;

export const StatColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  text-align: center;
  gap: 0.35rem;
`;

export const StatLabel = styled.span`
  font-size: 0.68rem;
  color: ${(props) => props.theme.colors.accent};
  letter-spacing: 0.05em;
`;

export const StatIcon = styled.img`
  width: 22px;
  height: 22px;
  display: block;
  filter: brightness(0) saturate(100%) invert(17%) sepia(53%) saturate(800%) hue-rotate(193deg) brightness(90%) contrast(96%);
`;

export const StatValue = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
`;

export const AccessibilityBadge = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  direction: rtl;
  color: ${(props) => props.theme.colors.primary};
  font-weight: 600;
  font-size: 0.9rem;
`;

export const AccessibilityIcon = styled.img`
  width: 28px;
  height: 28px;
  display: block;
  filter: brightness(0) saturate(100%) invert(17%) sepia(53%) saturate(800%) hue-rotate(193deg) brightness(90%) contrast(96%);
`;

export const Description = styled.p`
  margin-top: 1rem;
  white-space: pre-line;
`;

export const ActionButton = styled(SharedActionButton)`
  margin-top: 1.5rem;
  display: block;
  margin-inline-start: auto;
`;

