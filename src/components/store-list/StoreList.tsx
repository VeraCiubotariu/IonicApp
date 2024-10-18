import "./StoreList.css";
import { IonList, IonLoading } from "@ionic/react";
import RecordItem from "../../models/record-item";
import { StoreItem } from "../store-item";
import { ItemContext } from "../../store/item-provider";
import React, { useContext } from "react";

export const StoreList = ({ history }: { history: any }) => {
  const { items, fetching, fetchingError } = useContext(ItemContext);
  console.log("render", fetching);

  return (
    <>
      <IonLoading isOpen={fetching} message="Fetching items" />
      {items && (
        <IonList className="records-list">
          {items.map((record: RecordItem) => {
            return (
              record.id && (
                <StoreItem key={record.id} record={record} history={history} />
              )
            );
          })}
        </IonList>
      )}
      {fetchingError && (
        <div>{fetchingError.message || "Failed to fetch items"}</div>
      )}
    </>
  );
};
