import {
  ManagementCard,
  DetailText,
  ButtonsRow,
} from "../../styles/AdminPagesStyle";

const AdminEntityCard = ({ title, details, actions }) => {
  return (
    <ManagementCard>
      <div>
        <h2>{title}</h2>

        {details.map((detail) => (
          <DetailText key={detail.label}>
            {detail.label && <strong>{detail.label}: </strong>}
            {detail.value}
          </DetailText>
        ))}
      </div>

      {actions.length > 0 && (
        <ButtonsRow>
          {actions.map((action) => (
            <action.Component
              key={action.label}
              type="button"
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.label}
            </action.Component>
          ))}
        </ButtonsRow>
      )}
    </ManagementCard>
  );
};

export default AdminEntityCard;