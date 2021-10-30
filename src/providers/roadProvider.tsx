import React, { useCallback, useContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import { getLogger } from "../core";
import { RoadProps } from "../components/RoadProps";
import {
  createRoad,
  getRoads,
  newWebSocket,
  updateRoad,
} from "../components/roadApi";
import { AuthContext } from "./authProvider";

const log = getLogger("RoadProvider");

type SaveRoadFn = (road: RoadProps) => Promise<any>;

export interface RoadsState {
  roads?: RoadProps[];
  fetching: boolean;
  fetchingError?: Error | null;
  saving: boolean;
  savingError?: Error | null;
  saveRoad?: SaveRoadFn;
}

interface ActionProps {
  type: string;
  payload?: any;
}

const initialState: RoadsState = {
  fetching: false,
  saving: false,
};

const FETCH_ROADS_STARTED = "FETCH_ROADS_STARTED";
const FETCH_ROADS_SUCCEEDED = "FETCH_ROADS_SUCCEEDED";
const FETCH_ROADS_FAILED = "FETCH_ROADS_FAILED";
const SAVE_ROAD_STARTED = "SAVE_ROAD_STARTED";
const SAVE_ROAD_SUCCEEDED = "SAVE_ROAD_SUCCEEDED";
const SAVE_ROAD_FAILED = "SAVE_ROAD_FAILED";
const CLEAR_ROADS = "CLEAR_ROADS";

const reducer: (state: RoadsState, action: ActionProps) => RoadsState = (
  state,
  { type, payload }
) => {
  switch (type) {
    case FETCH_ROADS_STARTED:
      return { ...state, fetching: true, fetchingError: null };
    case FETCH_ROADS_SUCCEEDED:
      return { ...state, roads: payload.roads, fetching: false };
    case FETCH_ROADS_FAILED:
      return { ...state, fetchingError: payload.error, fetching: false };
    case SAVE_ROAD_STARTED:
      return { ...state, savingError: null, saving: true };
    case SAVE_ROAD_SUCCEEDED:
      const roads = [...(state.roads || [])];
      const { road } = payload;
      const index = roads.findIndex((it) => it.id === road.id);
      if (index === -1) {
        roads.splice(0, 0, road);
      } else {
        roads[index] = road;
      }
      return { ...state, roads, saving: false };
    case SAVE_ROAD_FAILED:
      return { ...state, savingError: payload.error, saving: false };
    case CLEAR_ROADS:
      return { ...state, roads: [] };

    default:
      return state;
  }
};

export const RoadContext = React.createContext<RoadsState>(initialState);

interface RoadProviderProps {
  children: PropTypes.ReactNodeLike;
}

export const RoadProvider: React.FC<RoadProviderProps> = ({ children }) => {
  const { authToken } = useContext(AuthContext);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { roads, fetching, fetchingError, saving, savingError } = state;

  useEffect(getRoadsEffect, [authToken]);
  useEffect(wsEffect, [authToken]);

  const saveRoad = useCallback<SaveRoadFn>(saveRoadCallback, []);
  const value = {
    roads,
    fetching,
    fetchingError,
    saving,
    savingError,
    saveRoad: saveRoad,
  };
  return <RoadContext.Provider value={value}>{children}</RoadContext.Provider>;

  function getRoadsEffect() {
    let canceled = false;

    if (authToken) {
      fetchRoads();
    } else {
      dispatch({ type: CLEAR_ROADS });
    }
    return () => {
      canceled = true;
    };

    async function fetchRoads() {
      try {
        dispatch({ type: FETCH_ROADS_STARTED });
        const roads = await getRoads();
        if (!canceled) {
          dispatch({ type: FETCH_ROADS_SUCCEEDED, payload: { roads } });
        }
      } catch (error) {
        dispatch({ type: FETCH_ROADS_FAILED, payload: { error } });
      }
    }
  }

  async function saveRoadCallback(road: RoadProps) {
    try {
      dispatch({ type: SAVE_ROAD_STARTED });
      const savedRoad = await (road.id ? updateRoad(road) : createRoad(road));
      dispatch({ type: SAVE_ROAD_SUCCEEDED, payload: { road: savedRoad } });
    } catch (error) {
      dispatch({ type: SAVE_ROAD_FAILED, payload: { error } });
    }
  }

  function wsEffect() {
    if (authToken) {
      let canceled = false;
      const closeWebSocket = newWebSocket((message) => {
        if (canceled) {
          return;
        }
        const {
          event,
          payload: { road },
        } = message;
        if (event === "created" || event === "updated") {
          dispatch({ type: SAVE_ROAD_SUCCEEDED, payload: { road } });
        }
      });
      return () => {
        canceled = true;
        closeWebSocket();
      };
    }
  }
};
