import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { add } from "ionicons/icons";
import "./AddItemIcon.css";

export const AddItemIcon = ({ history }: { history: any }) => {
  return (
    <IonFab vertical="bottom" horizontal="end" slot="fixed">
      <IonFabButton
        onClick={() => {
          history.push("/item");
        }}
      >
        <IonIcon icon={add} />
      </IonFabButton>
    </IonFab>
  );
};
