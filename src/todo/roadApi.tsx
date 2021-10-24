import axios from "axios";
import { getLogger } from "../core";
import { RoadProps } from "./RoadProps";

const log = getLogger("roadApi");

const baseUrl = "localhost:3000";
const roadUrl = `http://${baseUrl}/road`;

interface ResponseProps<T> {
  data: T;
}

function withLogs<T>(
  promise: Promise<ResponseProps<T>>,
  fnName: string
): Promise<T> {
  return promise
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const getRoads: () => Promise<RoadProps[]> = () => {
  return withLogs(axios.get(roadUrl, config), "getRoads");
};

export const createRoad: (road: RoadProps) => Promise<RoadProps[]> = (road) => {
  return withLogs(axios.post(roadUrl, road, config), "createRoad");
};

export const updateRoad: (road: RoadProps) => Promise<RoadProps[]> = (road) => {
  return withLogs(
    axios.put(`${roadUrl}/${road.id}`, road, config),
    "updateRoad"
  );
};

interface MessageData {
  event: string;
  payload: {
    road: RoadProps;
  };
}

export const newWebSocket = (onMessage: (data: MessageData) => void) => {
  const ws = new WebSocket(`ws://${baseUrl}`);
  ws.onopen = () => {
    log("web socket onopen");
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
