import { createAnimation, IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { add } from "ionicons/icons";
import "./AddItemIcon.css";
import { useEffect, useRef } from "react";

export const AddItemIcon = ({ history }: { history: any }) => {
  const fabRef = useRef(null);

  useEffect(() => {
    if (fabRef.current) {
      const animation = createAnimation()
        .addElement(fabRef.current)
        .duration(2000)
        .iterations(Infinity)
        .keyframes([
          { offset: 0, width: "64px", height: "64px" },
          { offset: 0.5, width: "56px", height: "56px" },
          { offset: 1, width: "64px", height: "64px" },
        ]);

      animation.play();
    }
  }, []);

  return (
    <IonFab vertical="bottom" horizontal="end" slot="fixed">
      <IonFabButton
        ref={fabRef}
        onClick={() => {
          history.push("/item");
        }}
      >
        <IonIcon icon={add} />
      </IonFabButton>
    </IonFab>
  );
};
