import "./StoreList.css";
import {
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import RecordItem from "../../models/record-item";
import { StoreItem } from "../store-item";
import { ItemContext, PAGE_SIZE } from "../../store/item-provider";
import React, { useContext, useState } from "react";
import { usePage } from "../../store/page-provider";

export const StoreList = ({ history }: { history: any }) => {
  const { items, fetchPage, fetching, fetchingError } = useContext(ItemContext);
  const [searchText, setSearchText] = useState("");
  const [disableInfiniteScroll, setDisableInfiniteScroll] =
    useState<boolean>(false);
  const { currentPage, setCurrentPage } = usePage();
  const [filterCondition, setFilterCondition] = useState<string>("name");
  console.log("render", fetching);

  async function fetchData() {
    if (items?.length && items?.length > currentPage * PAGE_SIZE) {
      console.log("Disabled infinite scroll");
      setDisableInfiniteScroll(true);
      return;
    }

    if (items?.length && items?.length < (currentPage - 1) * PAGE_SIZE) {
      console.log("Disabled infinite scroll");
      setDisableInfiniteScroll(true);
      return;
    }

    const prevItems = items;

    fetchPage && (await fetchPage(currentPage, PAGE_SIZE));

    /*if (_.isEqual(items, prevItems)) {
      console.log("Disabled infinite scroll");
      setDisableInfiniteScroll(true);
      return;
    }*/
    setCurrentPage(currentPage + 1);

    console.log("ITEMS: " + items?.length + " --- " + currentPage * PAGE_SIZE);

    if (items?.length && items?.length < (currentPage - 1) * PAGE_SIZE) {
      console.log("Disabled infinite scroll");
      setDisableInfiniteScroll(true);
    }
  }

  async function searchNext($event: CustomEvent<void>) {
    await fetchData();
    await ($event.target as HTMLIonInfiniteScrollElement).complete();
  }

  return (
    <>
      <IonSearchbar
        value={searchText}
        onIonInput={(e) => setSearchText(e.detail.value!)}
      />
      <IonSelect
        label="Filter by"
        placeholder="Name"
        interface="popover"
        onIonChange={(e) => {
          console.log(`ionChange fired with value: ${e.detail.value}`);
          setFilterCondition(e.detail.value!);
        }}
      >
        <IonSelectOption value="name">Name</IonSelectOption>
        <IonSelectOption value="artist">Artist</IonSelectOption>
        <IonSelectOption value="price">Price</IonSelectOption>
      </IonSelect>
      {/*<IonLoading isOpen={fetching} message="Fetching items" />*/}
      {items && (
        <IonContent>
          <IonList className="records-list">
            {items
              .filter((record) => {
                switch (filterCondition) {
                  case "name":
                    return record.name.indexOf(searchText) == 0;
                  case "artist":
                    return record.artist.indexOf(searchText) == 0;
                  case "price":
                    return (
                      record.price.toString() == searchText || searchText == ""
                    );
                  default:
                    return record;
                }
              })
              .map((record: RecordItem) => {
                return (
                  record._id && (
                    <StoreItem
                      key={record._id}
                      record={record}
                      history={history}
                    />
                  )
                );
              })}
            <IonInfiniteScroll
              threshold="100px"
              disabled={disableInfiniteScroll}
              onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}
            >
              <IonInfiniteScrollContent loadingText="Loading more records..."></IonInfiniteScrollContent>
            </IonInfiniteScroll>
          </IonList>
        </IonContent>
      )}
      {fetchingError && (
        <div>{fetchingError.message || "Failed to fetch items"}</div>
      )}
    </>
  );
};
