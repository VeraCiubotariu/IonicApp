import { useContext, useEffect, useState } from "react";
import RecordItem from "../models/record-item";
import { ItemContext } from "../store/item-provider";
import { History } from "history";
import { match } from "react-router";

export const useItemEditControls = (
  history: History,
  match: match<{ id: string }>,
) => {
  const { items, saveItem, deleteItem } = useContext(ItemContext);
  const [selectedItem, setSelectedItem] = useState<RecordItem>();
  const [name, setName] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  const [isBand, setIsBand] = useState<boolean>(false);
  const [releaseDate, setReleaseDate] = useState<Date>(new Date());
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    if (items) {
      const routeId = match.params.id || "";
      const item = items.find((x) => x._id == routeId);
      setSelectedItem(item);
    }
  }, [match.params.id]);

  useEffect(() => {
    if (selectedItem) {
      console.log(selectedItem);
      setName(selectedItem.name);
      setReleaseDate(selectedItem.releaseDate);
      setPrice(selectedItem.price);
      setArtist(selectedItem.artist);
      setIsBand(selectedItem.isBand);
    }
  }, [selectedItem]);

  const handleSave = () => {
    const editedItem: RecordItem = selectedItem
      ? { ...selectedItem, name, artist, releaseDate, price, isBand }
      : {
          name: name,
          artist: artist,
          releaseDate: releaseDate,
          price: price,
          isBand: isBand,
        };
    saveItem && saveItem(editedItem).then(() => history.goBack());
  };

  const handleDelete = () => {
    if (selectedItem?._id) {
      deleteItem && deleteItem(selectedItem?._id).then(() => history.goBack());
    }
  };

  return {
    name,
    setName,
    artist,
    setArtist,
    isBand,
    setIsBand,
    releaseDate,
    setReleaseDate,
    price,
    setPrice,
    handleSave,
    handleDelete,
  };
};
