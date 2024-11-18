import {
  createAnimation,
  IonContent,
  IonFab,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useRef } from "react";
import "./HomePage.css";
import { RouteComponentProps } from "react-router";
import { AddItemIcon, OnlineStatusIcon, StoreList } from "../components";
import { LogoutButton } from "../components/logout-button/LogoutButton";

const HomePage: React.FC<RouteComponentProps> = ({ history }) => {
  const titleRef = useRef<HTMLIonTitleElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      const animation = createAnimation()
        .addElement(titleRef.current)
        .duration(5000)
        .iterations(Infinity)
        .keyframes([
          { offset: 0, color: "red" },
          { offset: 0.25, color: "orange" },
          { offset: 0.5, color: "magenta" },
          { offset: 0.75, color: "firebrick" },
          { offset: 1, color: "red" },
        ]);

      animation.play();
    }
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle ref={titleRef}>Record Store</IonTitle>
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
            <IonTitle size="large" ref={titleRef}>
              Record Store
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <StoreList history={history} />
        <AddItemIcon history={history} />
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
