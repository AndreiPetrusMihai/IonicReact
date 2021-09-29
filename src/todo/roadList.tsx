import React, { useContext } from "react";
import { RouteComponentProps } from "react-router";
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonList,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { add } from "ionicons/icons";
import Road from "./road";
import { getLogger } from "../core";
import { RoadContext } from "./roadProvider";

const log = getLogger("RoadList");

const RoadList: React.FC<RouteComponentProps> = ({ history }) => {
  const { roads, fetching, fetchingError } = useContext(RoadContext);
  log("render");
  console.log(roads);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
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
      </IonContent>
    </IonPage>
  );
};

export default RoadList;
