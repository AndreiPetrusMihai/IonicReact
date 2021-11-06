import React, { useContext } from "react";
import { RouteComponentProps } from "react-router";
import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonList,
  IonLoading,
  IonPage,
} from "@ionic/react";
import { add } from "ionicons/icons";
import Road from "../components/road";
import { getLogger } from "../core";
import { RoadContext } from "../providers/roadProvider";

const log = getLogger("RoadList");

const RoadList: React.FC<RouteComponentProps> = ({ history }) => {
  const { roads, fetching, fetchingError } = useContext(RoadContext);
  console.log("re");
  return (
    <div>
      <IonLoading isOpen={fetching} message="Fetching roads" />
      {roads && (
        <IonList>
          {roads.map(({ id, name }) => (
            <Road
              key={id}
              id={id}
              name={name}
              onEdit={(id) => history.push(`/road/${id}`)}
            />
          ))}
        </IonList>
      )}
      {fetchingError && (
        <div>{fetchingError.message || "Failed to fetch roads"}</div>
      )}
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => history.push("/road")}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
    </div>
  );
};

export default RoadList;
