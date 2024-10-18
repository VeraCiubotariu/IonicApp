import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./HomePage.css";
import { RouteComponentProps } from "react-router";
import { AddItemIcon, StoreList } from "../components";

const HomePage: React.FC<RouteComponentProps> = ({ history }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Record Store</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Record Store</IonTitle>
          </IonToolbar>
        </IonHeader>
        <StoreList history={history} />
        <AddItemIcon history={history} />
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
