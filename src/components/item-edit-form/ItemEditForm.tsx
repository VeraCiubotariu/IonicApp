import "./ItemEditForm.css";
import {
  IonButton,
  IonCheckbox,
  IonDatetime,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
} from "@ionic/react";
import useItemEditControls from "../../hooks/useItemEditControls";
import { useContext } from "react";
import { ItemContext } from "../../store/item-provider";

export const ItemEditForm = ({
  history,
  match,
}: {
  history: any;
  match: any;
}) => {
  const {
    name,
    price,
    artist,
    isBand,
    releaseDate,
    setName,
    setReleaseDate,
    setPrice,
    setArtist,
    setIsBand,
    handleSave,
    handleDelete,
  } = useItemEditControls(history, match);
  const { saving, savingError, deleting, deletingError } =
    useContext(ItemContext);

  return (
    <>
      <IonList inset={true}>
        <IonItem>
          <IonInput
            label="Name"
            placeholder={name}
            value={name}
            onIonInput={(e) =>
              setName((e.target as HTMLIonInputElement).value as string)
            }
          />
        </IonItem>
        <IonItem>
          <IonInput
            label="Artist"
            value={artist}
            onIonInput={(e) =>
              setArtist((e.target as HTMLIonInputElement).value as string)
            }
          />
        </IonItem>
        <IonItem>
          <IonCheckbox
            checked={isBand}
            onIonChange={(e) => {
              setIsBand(e.target.checked);
            }}
          >
            Is a band
          </IonCheckbox>
        </IonItem>
        <IonItem>
          <IonLabel>Release Date</IonLabel>
          <IonDatetime
            presentation="date"
            value={
              typeof releaseDate === "string"
                ? new Date(releaseDate).toISOString()
                : releaseDate.toISOString()
            }
            onIonChange={(e) => {
              const selectedDate = e.target.value;
              if (selectedDate) {
                setReleaseDate(new Date(Date.parse(e.target.value as string)));
              }
            }}
          ></IonDatetime>
        </IonItem>
        <IonItem>
          <IonInput
            label="Price"
            type="number"
            placeholder={price.toString()}
            value={price}
            onIonInput={(e) =>
              setPrice((e.target as HTMLIonInputElement).value as number)
            }
          />
        </IonItem>
      </IonList>
      <IonButton className="menu-button" onClick={handleSave}>
        Save
      </IonButton>
      {match.params.id && (
        <IonButton className="menu-button" onClick={handleDelete}>
          Delete
        </IonButton>
      )}
      <IonLoading isOpen={saving} message="Saving" />
      <IonLoading isOpen={deleting} message="Deleting" />
      {savingError && <div>{savingError.message || "Failed to save item"}</div>}
      {deletingError && (
        <div>{deletingError.message || "Failed to delete item"}</div>
      )}
    </>
  );
};
