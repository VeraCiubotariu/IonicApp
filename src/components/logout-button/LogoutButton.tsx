import { IonFab, IonIcon } from "@ionic/react";
import { logOutOutline } from "ionicons/icons";
import { Preferences } from "@capacitor/preferences";
import { useContext } from "react";
import { AuthContext } from "../../auth";
import "./LogoutButton.css";
import { ItemContext } from "../../store/item-provider";
import { usePage } from "../../store/page-provider";

export const LogoutButton = ({ history }: { history: any }) => {
  const { logout } = useContext(AuthContext);
  const { resetState } = useContext(ItemContext);
  const { setCurrentPage } = usePage();

  const handleLogout = () => {
    logout && logout();
    resetState && resetState();
    setCurrentPage(2);
    Preferences.clear().then(history.push("/login"));
  };

  return (
    <IonIcon
      className="logout-button"
      icon={logOutOutline}
      onClick={handleLogout}
    />
  );
};
