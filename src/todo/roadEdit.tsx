import React, { useContext, useEffect, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { getLogger } from "../core";
import { RoadContext } from "./roadProvider";
import { RouteComponentProps } from "react-router";
import { RoadProps } from "./RoadProps";

const log = getLogger("RoadEdit");

interface RoadEditProps
  extends RouteComponentProps<{
    id?: string;
  }> {}

const RoadEdit: React.FC<RoadEditProps> = ({ history, match }) => {
  const { roads, saving, savingError, saveRoad } = useContext(RoadContext);
  const [name, setName] = useState("");
  const [road, setRoad] = useState<RoadProps>();
  useEffect(() => {
    log("useEffect");
    const routeId = match.params.id || "";
    const road = roads?.find((it) => it.id === routeId);
    setRoad(road);
    if (road) {
      setName(road.name);
    }
  }, [match.params.id, roads]);
  const handleSave = () => {
    const editedRoad = road ? { ...road, name } : { name };
    saveRoad && saveRoad(editedRoad).then(() => history.goBack());
  };
  log("render");
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>Save</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput
          value={name}
          onIonChange={(e) => setName(e.detail.value || "")}
        />
        <IonLoading isOpen={saving} />
        {savingError && (
          <div>{savingError.message || "Failed to save road"}</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default RoadEdit;
