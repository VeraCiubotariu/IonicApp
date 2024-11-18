import "./StoreItem.css";
import { IonImg, IonItem } from "@ionic/react";
import RecordItem from "../../models/record-item";
import { useEffect, useState } from "react";
import { usePhotos } from "../../hooks";
import { MyPhoto } from "../../models/photo-types";

export const StoreItem = ({
  record,
  history,
}: {
  record: RecordItem;
  history: any;
}) => {
  const { getImageById } = usePhotos();
  const [image, setImage] = useState<MyPhoto | undefined>(undefined);

  useEffect(() => {
    getImageById(record._id!).then((img) => {
      img && setImage(img);
    });
  }, []);

  return (
    <>
      <IonItem
        className="records-list-item"
        onClick={() => {
          history.push(`/items/${record._id}`);
        }}
      >
        <div className="vinyl">
          {image && <IonImg src={image.webviewPath} />}
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
