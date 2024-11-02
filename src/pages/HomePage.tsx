import {
  IonContent,
  IonFab,
  IonHeader,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./HomePage.css";
import { RouteComponentProps } from "react-router";
import { AddItemIcon, OnlineStatusIcon, StoreList } from "../components";
import { LogoutButton } from "../components/logout-button/LogoutButton";

const HomePage: React.FC<RouteComponentProps> = ({ history }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Record Store</IonTitle>
        </IonToolbar>
        <IonFab
          className="logout-container"
          vertical="center"
          horizontal="end"
          slot="fixed"
        >
          <LogoutButton history={history} />
          <OnlineStatusIcon />
        </IonFab>
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
