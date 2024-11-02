import axios from "axios";
import {
  authConfig,
  baseUrl,
  getLogger,
  paramsAuthConfig,
  withLogs,
} from "../core";
import RecordItem from "../models/record-item";

const itemUrl = `http://${baseUrl}/api/item`;

export const getItems: (token: string) => Promise<RecordItem[]> = (token) => {
  return withLogs(axios.get(itemUrl, authConfig(token)), "getItems");
};

export const getItemsPage: (
  token: string,
  page: number,
  pageSize: number,
) => Promise<RecordItem[]> = (token, page, pageSize) => {
  return withLogs(
    axios.get(
      itemUrl,
      paramsAuthConfig(token, { page: page, pageSize: pageSize }),
    ),
    "getItemsPage",
  );
};

export const createItem: (
  token: string,
  item: RecordItem,
) => Promise<RecordItem[]> = (token, item) => {
  return withLogs(axios.post(itemUrl, item, authConfig(token)), "createItem");
};

export const updateItem: (
  token: string,
  item: RecordItem,
) => Promise<RecordItem[]> = (token, item) => {
  return withLogs(
    axios.put(`${itemUrl}/${item._id}`, item, authConfig(token)),
    "updateItem",
  );
};

export const removeItem: (
  token: string,
  id: string,
) => Promise<RecordItem[]> = (token, id) => {
  return withLogs(
    axios.delete(`${itemUrl}/${id}`, authConfig(token)),
    "deleteItem",
  );
};

interface MessageData {
  type: string;
  payload: RecordItem;
}

const log = getLogger("ws");

export const newWebSocket = (
  token: string,
  onMessage: (data: MessageData) => void,
) => {
  const ws = new WebSocket(`ws://${baseUrl}`);
  ws.onopen = () => {
    log("web socket onopen");
    ws.send(JSON.stringify({ type: "authorization", payload: { token } }));
  };
  ws.onclose = () => {
    log("web socket onclose");
  };
  ws.onerror = (error) => {
    log("web socket onerror", error);
  };
  ws.onmessage = (messageEvent) => {
    log("web socket onmessage");
    onMessage(JSON.parse(messageEvent.data));
  };
  return () => {
    ws.close();
  };
};
