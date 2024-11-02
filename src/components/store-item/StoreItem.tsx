import "./StoreItem.css";
import { IonItem } from "@ionic/react";
import RecordItem from "../../models/record-item";

export const StoreItem = ({
  record,
  history,
}: {
  record: RecordItem;
  history: any;
}) => {
  return (
    <>
      <IonItem
        className="records-list-item"
        onClick={() => {
          history.push(`/items/${record._id}`);
        }}
      >
        <div className="vinyl">
          <div className="labels">
            <div className="record-name">{record.name}</div>
            <div className="record-artist">{record.artist}</div>
            <div className="record-price">
              <b>{record.price} Lei</b>
            </div>
            {record.isOffline && <div>Offline item</div>}
          </div>
        </div>
      </IonItem>
    </>
  );
};
