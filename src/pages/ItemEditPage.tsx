import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { ItemEditForm } from "../components";
import ItemEditProps from "../models/item-edit-props";

const ItemEditPage: React.FC<ItemEditProps> = ({
  history,
  match,
}: ItemEditProps) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          {match.params.id && <IonTitle>Edit Record</IonTitle>}
          {!match.params.id && <IonTitle>Save Record</IonTitle>}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Edit Record</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ItemEditForm history={history} match={match} />
      </IonContent>
    </IonPage>
  );
};

export default ItemEditPage;
