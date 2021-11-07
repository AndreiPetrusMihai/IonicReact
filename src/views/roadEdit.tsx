import React, { useContext, useEffect, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonPage,
} from "@ionic/react";
import { getLogger } from "../core";
import { RoadContext } from "../providers/roadProvider";
import { RouteComponentProps, useHistory } from "react-router";
import { RoadProps } from "../components/RoadProps";

const log = getLogger("RoadEdit");

interface RoadEditProps
  extends RouteComponentProps<{
    id?: string;
  }> {}

const RoadEdit: React.FC<RoadEditProps> = ({ match }) => {
  const { roads, localSavedRoads, saving, savingError, saveRoad } =
    useContext(RoadContext);
  const history = useHistory();
  const [name, setName] = useState("");
  const [lanes, setLanes] = useState(0);
  const [lastMaintained, setLastMaintained] = useState<Date | null>(null);
  const [isOperational, setIsOperational] = useState(false);

  const [road, setRoad] = useState<RoadProps>();
  const routeId = match.params.id || "";
  console.log(localSavedRoads);
  const correspondingRoad = [
    ...(roads || []),
    ...(localSavedRoads || []),
  ]?.find((it) => it.id === parseInt(routeId));

  useEffect(() => {
    setRoad(correspondingRoad);
    if (correspondingRoad) {
      setName(correspondingRoad.name);
      setLanes(correspondingRoad.lanes || 0);
      setLastMaintained(
        new Date(correspondingRoad.lastMaintained as any as string) || null
      );
      setIsOperational(correspondingRoad.isOperational || false);
    }
  }, [correspondingRoad?.id, correspondingRoad?.version]);

  const handleSave = () => {
    const editedRoad = road
      ? { ...road, name, lanes, isOperational }
      : { name, lanes, isOperational };
    saveRoad && saveRoad(editedRoad).then(() => history.push("/roads"));
  };

  return (
    <>
      <IonItem>
        <IonLabel position="floating">Road Name</IonLabel>
        <IonInput
          value={name}
          onIonChange={(e) => setName(e.detail.value || "")}
        />
      </IonItem>

      <IonItem>
        <IonLabel position="floating">Lanes</IonLabel>
        <IonInput
          value={lanes}
          onIonChange={(e) => setLanes(parseInt(e.detail.value || "0"))}
        />
      </IonItem>

      <IonItem>
        <IonLabel position="floating">Last Maintained</IonLabel>
        <IonInput
          readonly
          value={lastMaintained?.toDateString() || "No info"}
        />
      </IonItem>

      <IonItem>
        <IonLabel position="floating">Is Operational</IonLabel>
        <IonCheckbox
          checked={isOperational}
          onIonChange={(e) => setIsOperational(e.detail.checked)}
        />
      </IonItem>
      <IonButtons>
        <IonButton onClick={handleSave}>Save</IonButton>
      </IonButtons>
      <IonButtons>
        <IonButton onClick={() => history.push("/roads")}>Back</IonButton>
      </IonButtons>
      <IonLoading isOpen={saving} />
      {savingError && <div>{savingError.message || "Failed to save road"}</div>}
    </>
  );
};

export default RoadEdit;
