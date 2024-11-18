import { IonIcon, IonLabel } from "@ionic/react";
import { wifi } from "ionicons/icons";
import "./OnlineStatusIcon.css";
import { useNetworkControls } from "../../hooks";

export const OnlineStatusIcon = () => {
  const { status } = useNetworkControls();

  return (
    <>
      {status && (
        <>
          <IonIcon
            className="online-status-icon"
            style={{ color: "green" }}
            icon={wifi}
          />
          <IonLabel className="icon-label" style={{ color: "green" }}>
            Online
          </IonLabel>
        </>
      )}

      {!status && (
        <>
          <IonIcon
            className="online-status-icon"
            style={{ color: "red" }}
            icon={wifi}
          />
          <IonLabel className="icon-label" style={{ color: "red" }}>
            Offline
          </IonLabel>
        </>
      )}
    </>
  );
};
