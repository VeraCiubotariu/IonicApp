import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import PropTypes from "prop-types";
import { getLogger } from "../core";
import RecordItem from "../models/record-item";
import {
  createItem,
  getItems,
  getItemsPage,
  newWebSocket,
  removeItem,
  updateItem,
} from "../api/item-api";
import { AuthContext } from "../auth";
import { useNetworkControls } from "../hooks";
import { Preferences } from "@capacitor/preferences";

const log = getLogger("ItemProvider");

type SaveItemFn = (item: RecordItem) => Promise<any>;
type DeleteItemFn = (itemId: string) => Promise<any>;
type FetchPageFn = (page: number, pageSize: number) => Promise<any>;
type ResetStateFn = () => Promise<any>;
export const PAGE_SIZE = 8;

export interface ItemsState {
  items?: RecordItem[];
  fetching: boolean;
  fetchingError?: Error | null;
  saving: boolean;
  savingError?: Error | null;
  saveItem?: SaveItemFn;
  fetchPage?: FetchPageFn;
  deleting: boolean;
  deletingError?: Error | null;
  deleteItem?: DeleteItemFn;
  resetState?: ResetStateFn;
}

interface ActionProps {
  type: string;
  payload?: any;
}

const initialState: ItemsState = {
  fetching: false,
  saving: false,
  deleting: false,
};

const FETCH_ITEMS_STARTED = "FETCH_ITEMS_STARTED";
const FETCH_ITEMS_SUCCEEDED = "FETCH_ITEMS_SUCCEEDED";
const FETCH_ITEMS_FAILED = "FETCH_ITEMS_FAILED";
const SAVE_ITEM_STARTED = "SAVE_ITEM_STARTED";
const SAVE_ITEM_SUCCEEDED = "SAVE_ITEM_SUCCEEDED";
const SAVE_ITEM_FAILED = "SAVE_ITEM_FAILED";
const DELETE_ITEM_STARTED = "DELETE_ITEM_STARTED";
const DELETE_ITEM_SUCCEEDED = "DELETE_ITEM_SUCCEEDED";
const DELETE_ITEM_FAILED = "DELETE_ITEM_FAILED";
const RESET_STATE = "RESET_STATE";

const reducer: (state: ItemsState, action: ActionProps) => ItemsState = (
  state,
  { type, payload },
) => {
  switch (type) {
    case FETCH_ITEMS_STARTED:
      return { ...state, fetching: true, fetchingError: null };
    case FETCH_ITEMS_SUCCEEDED:
      const newItems = state.items
        ? state.items.concat(payload.items as RecordItem[])
        : (payload.items as RecordItem[]);

      console.log("New items" + newItems.toString());

      return {
        ...state,
        items: newItems,
        fetching: false,
      };
    case FETCH_ITEMS_FAILED:
      return { ...state, fetchingError: payload.error, fetching: false };
    case SAVE_ITEM_STARTED:
      return { ...state, savingError: null, saving: true };
    case SAVE_ITEM_SUCCEEDED:
      const items = [...(state.items || [])];
      const item = payload.item;
      console.log("Saving item....");
      console.log(item);
      const index = items.findIndex((it) => it._id === item._id);
      if (index === -1) {
        items.splice(0, 0, item);
      } else {
        items[index] = item;
      }
      return { ...state, items, saving: false };
    case SAVE_ITEM_FAILED:
      return { ...state, savingError: payload.error, saving: false };
    case DELETE_ITEM_STARTED:
      return { ...state, deletingError: null, deleting: true };
    case DELETE_ITEM_SUCCEEDED:
      const id = payload.id;
      const dItems = [...(state.items || [])].filter((item) => item._id !== id);
      return { ...state, items: dItems, deleting: false };
    case DELETE_ITEM_FAILED:
      return { ...state, deletingError: payload.error, deleting: false };
    case RESET_STATE:
      return { ...initialState };
    default:
      return state;
  }
};

export const ItemContext = React.createContext<ItemsState>(initialState);

interface ItemProviderProps {
  children: PropTypes.ReactNodeLike;
}

export const ItemProvider: React.FC<ItemProviderProps> = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [offlineId, setOfflineId] = useState<number>(0);
  const { getStatus } = useNetworkControls();
  const {
    items,
    fetching,
    fetchingError,
    saving,
    savingError,
    deleting,
    deletingError,
  } = state;

  useEffect(getItemsEffect, [token]);
  useEffect(wsEffect, [token]);

  const saveItem = useCallback<SaveItemFn>(saveItemCallback, [token]);
  const deleteItem = useCallback<DeleteItemFn>(deleteItemCallback, [token]);
  const fetchPage = useCallback<FetchPageFn>(fetchPageCallback, [token]);
  const resetState = useCallback<ResetStateFn>(resetStateCallback, [token]);

  const value = {
    items,
    fetching,
    fetchingError,
    saving,
    savingError,
    saveItem,
    fetchPage,
    deleting,
    deletingError,
    deleteItem,
    resetState,
  };
  log("returns");
  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;

  function getItemsEffect() {
    let canceled = false;
    if (token) {
      fetchPage(1, PAGE_SIZE);
    }
    return () => {
      canceled = true;
    };
  }

  async function fetchItems() {
    let canceled = false;

    try {
      log("fetchItems started");
      dispatch({ type: FETCH_ITEMS_STARTED });
      const items = await getItems(token);
      log("fetchItems succeeded");
      if (!canceled) {
        dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { items } });
      }
    } catch (error) {
      log("fetchItems failed", error);
      dispatch({ type: FETCH_ITEMS_FAILED, payload: { error } });
    }
  }

  async function resetStateCallback() {
    dispatch({ type: RESET_STATE });
  }

  async function fetchPageCallback(page: number, pageSize: number) {
    try {
      log("fetchItemsPage started");
      dispatch({ type: FETCH_ITEMS_STARTED });
      const items = await getItemsPage(token, page, pageSize);
      log("fetchItems succeeded");
      dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { items } });
    } catch (error) {
      log("fetchItems failed", error);
      dispatch({ type: FETCH_ITEMS_FAILED, payload: { error } });
    }
  }

  async function saveItemOffline(item: RecordItem) {
    try {
      const { value } = await Preferences.get({ key: "savedItems" });
      const savedItems = value ? JSON.parse(value) : [];

      setOfflineId((prevOfflineId) => {
        const newId = prevOfflineId + 1;
        item._id = "offline" + newId;
        savedItems.push(item);

        // Update Preferences with new saved item list
        Preferences.set({
          key: "savedItems",
          value: JSON.stringify(savedItems),
        });

        log("Item saved offline in Preferences");
        return newId;
      });

      return item;
    } catch (e) {
      log("Failed to save item offline", e);
    }
  }

  async function updateItemOffline(item: RecordItem) {
    try {
      const { value } = await Preferences.get({ key: "updatedItems" });
      const updatedItems = value ? JSON.parse(value) : [];

      updatedItems.push(item);

      await Preferences.set({
        key: "updatedItems",
        value: JSON.stringify(updatedItems),
      });

      log("Item updated offline in Preferences");
      return item;
    } catch (e) {
      log("Failed to update item offline", e);
    }
  }

  async function saveItemCallback(item: RecordItem) {
    try {
      delete item.isOffline;
      log("saveItem started");
      dispatch({ type: SAVE_ITEM_STARTED });
      const savedItem = await (item._id
        ? updateItem(token, item)
        : createItem(token, item));
      log("saveItem succeeded");
      console.log(savedItem);
      dispatch({
        type: SAVE_ITEM_SUCCEEDED,
        payload: { item: savedItem },
      });
    } catch (error) {
      log("saveItem failed");

      //Offline behaviour
      if (!(await getStatus())) {
        log("Saving offline...");
        item.isOffline = true;

        if (item._id) {
          await updateItemOffline(item);
          dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item: item } });
        } else {
          const savedItem = await saveItemOffline(item);
          dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item: savedItem } });
        }

        return;
      }

      dispatch({ type: SAVE_ITEM_FAILED, payload: { error } });
    }
  }

  async function deleteItemCallback(id: string) {
    try {
      if (id.startsWith("offline")) {
        dispatch({ type: DELETE_ITEM_SUCCEEDED, payload: { id: id } });
        return;
      }

      log("delete item started");
      dispatch({ type: DELETE_ITEM_STARTED });
      await removeItem(token, id);
      log("deleteItem succeeded");
      dispatch({ type: DELETE_ITEM_SUCCEEDED, payload: { id: id } });
    } catch (error) {
      log("deleteItem failed");
      dispatch({ type: DELETE_ITEM_FAILED, payload: { error } });
    }
  }

  function wsEffect() {
    let canceled = false;
    log("wsEffect - connecting");
    let closeWebSocket: () => void;
    if (token?.trim()) {
      closeWebSocket = newWebSocket(token, (message) => {
        if (canceled) {
          return;
        }
        const { type, payload: item } = message;
        log(`ws message, ${type}`);
        log(item);

        switch (type) {
          case "created":
            dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item: item } });
            break;
          case "updated":
            dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item: item } });
            break;
          case "deleted":
            if (item._id) {
              dispatch({
                type: DELETE_ITEM_SUCCEEDED,
                payload: { id: item._id },
              });
            }
            break;
        }
      });
    }
    return () => {
      log("wsEffect - disconnecting");
      canceled = true;
      closeWebSocket?.();
    };
  }
};
