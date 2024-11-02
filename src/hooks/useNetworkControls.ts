import { useContext, useEffect, useState } from "react";
import { Network } from "@capacitor/network";
import { Preferences } from "@capacitor/preferences";
import { ItemContext } from "../store/item-provider";
import RecordItem from "../models/record-item";

export const useNetworkControls = () => {
  const [status, setStatus] = useState<boolean>();
  const { saveItem, deleteItem } = useContext(ItemContext);
  const context = useContext(ItemContext);

  const getStatus = async () => {
    const networkStatus = await Network.getStatus();
    setStatus(networkStatus.connected);
    return networkStatus.connected;
  };

  useEffect(() => {
    getStatus();

    const listener = Network.addListener(
      "networkStatusChange",
      (currStatus) => {
        setStatus(currStatus.connected);
        console.log("Network status changed!");

        if (currStatus.connected && saveItem) {
          saveChanges();
        }
      },
    );

    return () => {
      listener
        .then((handle) => handle.remove())
        .catch((error) => {
          console.error("Failed to remove network listener:", error);
        });
    };
  }, []);

  const saveChanges = async () => {
    console.log(context);
    const savedValue = (await Preferences.get({ key: "savedItems" })).value;
    const savedItems = savedValue ? JSON.parse(savedValue) : [];

    const updatedValue = (await Preferences.get({ key: "updatedItems" })).value;
    const updatedItems = updatedValue ? JSON.parse(updatedValue) : [];

    if (savedItems.length > 0) {
      console.log("Saving items from Preferences...");
      console.log(context);
      console.log(saveItem);
      for (const item of savedItems) {
        deleteItem && deleteItem(item._id);
        delete item._id;
        saveItem && saveItem(item);
      }

      await Preferences.remove({ key: "savedItems" });
    }

    if (updatedItems.length > 0) {
      console.log("Updating items from Preferences...");
      for (const item of updatedItems) {
        saveItem && saveItem(item);
      }

      await Preferences.remove({ key: "updatedItems" });
    }
  };

  return {
    status,
    getStatus,
  };
};
