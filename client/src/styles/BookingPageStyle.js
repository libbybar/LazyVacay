import styled from "styled-components";

const navyFilter = "brightness(0) saturate(100%) invert(17%) sepia(53%) saturate(800%) hue-rotate(193deg) brightness(90%) contrast(96%)";

export const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
  direction: rtl;
`;

export const TwoColumnLayout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  background-color: ${(props) => props.theme.colors.cardBg};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(44, 62, 80, 0.06);

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const RoomPreviewPanel = styled.div`
  flex: 0 0 360px;
  display: flex;
  flex-direction: column;
  direction: rtl;
  padding-top: 28px;

  @media (max-width: 768px) {
    flex: none;
    padding-top: 0;
  }
`;

export const RoomPreviewImage = styled.img`
  width: 100%;
  height: 260px;
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

export const RoomPreviewContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

export const PanelDivider = styled.div`
  width: 32px;
  flex-shrink: 0;
  align-self: stretch;
  position: relative;
  overflow: hidden;

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 560px;
    height: 32px;
    transform: translate(-50%, -50%) rotate(90deg);
    opacity: 0.4;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const FormPanel = styled.div`
  flex: 1;
  padding: 2rem;
  direction: rtl;
`;

export const RoomName = styled.h2`
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 0.15rem;
  text-align: center;
`;

export const HotelPreviewName = styled.p`
  color: ${(props) => props.theme.colors.accent};
  font-weight: 600;
  margin-bottom: 0.25rem;
  text-align: center;
`;

export const DetailText = styled.p`
  margin-bottom: 0.5rem;
`;

export const PreviewIconRow = styled.div`
  display: flex;
  flex-direction: row;
  direction: rtl;
  gap: 1.25rem;
  margin: 0.5rem 0;
  flex-wrap: wrap;
  justify-content: center;
`;

export const PreviewIconItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  text-align: center;
`;

export const PreviewIconLabel = styled.span`
  font-size: 0.68rem;
  color: ${(props) => props.theme.colors.accent};
  letter-spacing: 0.04em;
`;

export const PreviewIconValueRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.35rem;
  font-size: 1rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.primary};
`;

export const PreviewIcon = styled.img`
  width: 22px;
  height: 22px;
  display: block;
  filter: ${navyFilter};
`;

export const AccessibilityBadge = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 0.25rem;
  color: ${(props) => props.theme.colors.primary};
  font-size: 0.9rem;
  font-weight: 600;
`;

export const AccessibilityIcon = styled.img`
  width: 22px;
  height: 22px;
  display: block;
  filter: ${navyFilter};
`;

export const DescriptionPreview = styled.p`
  font-size: 0.88rem;
  line-height: 1.55;
  white-space: pre-line;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 0.35rem;
  color: ${(props) => props.theme.colors.primary};
  opacity: 0.8;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

export const PriceBox = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 6px;
  padding: 1rem;
`;

export const SuccessText = styled.p`
  text-align: center;
  font-weight: bold;
  color: ${(props) => props.theme.colors.success};
`;

export const ModalCard = styled.article`
  width: 100%;
  max-width: 520px;
  background-color: ${(props) => props.theme.colors.cardBg};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 8px;
  padding: 2rem;
  direction: rtl;
`;

export const ModalTitle = styled.h2`
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

export const ModalSubtitle = styled.p`
  margin-bottom: 1.5rem;
`;

export const ModalDetails = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border: ${(props) => props.theme.borders.atlas};
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-start;

  @media (max-width: 520px) {
    flex-direction: column;
  }
`;
