import { createAnimation, IonButton, IonIcon, IonModal } from "@ionic/react";
import { logOutOutline } from "ionicons/icons";
import React, { useContext, useState } from "react";
import "./LogoutButton.css";
import { AuthContext } from "../../auth";
import { ItemContext } from "../../store/item-provider";
import { usePage } from "../../store/page-provider";
import { Preferences } from "@capacitor/preferences";

export const LogoutButton = ({ history }: { history: any }) => {
  const [showModal, setShowModal] = useState(false);
  console.log(showModal);

  const { logout } = useContext(AuthContext);
  const { resetState } = useContext(ItemContext);
  const { setCurrentPage } = usePage();

  const handleLogout = () => {
    logout && logout();
    resetState && resetState();
    setCurrentPage(2);
    Preferences.clear().then(history.push("/login"));
  };

  const enterAnimation = (baseEl: any) => {
    const root = baseEl.shadowRoot;
    const backdropAnimation = createAnimation()
      .addElement(root.querySelector("ion-backdrop")!)
      .fromTo("opacity", "0.01", "var(--backdrop-opacity)");

    const wrapperAnimation = createAnimation()
      .addElement(root.querySelector(".modal-wrapper")!)
      .keyframes([
        { offset: 0, opacity: "0", transform: "scale(0)" },
        { offset: 1, opacity: "0.99", transform: "scale(1)" },
      ]);

    return createAnimation()
      .addElement(baseEl)
      .easing("ease-out")
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  const leaveAnimation = (baseEl: any) => {
    return enterAnimation(baseEl).direction("reverse");
  };

  return (
    <>
      <IonIcon
        className="logout-button"
        icon={logOutOutline}
        onClick={() => setShowModal(true)}
      />
      <IonModal
        isOpen={showModal}
        enterAnimation={enterAnimation}
        leaveAnimation={leaveAnimation}
      >
        <p>Are you sure you want to log out?</p>
        <IonButton
          onClick={() => {
            handleLogout();
            setShowModal(false);
          }}
        >
          Yes
        </IonButton>
        <IonButton onClick={() => setShowModal(false)}>No</IonButton>
      </IonModal>
    </>
  );
};
