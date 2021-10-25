import React, { useContext, useEffect, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
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
  const [lanes, setLanes] = useState(0);
  const [lastMaintained, setLastMaintained] = useState<Date | null>(null);
  const [isOperational, setIsOperational] = useState(false);

  const [road, setRoad] = useState<RoadProps>();
  const routeId = match.params.id || "";

  const correspondingRoad = roads?.find((it) => it.id === routeId);

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

        <IonLoading isOpen={saving} />
        {savingError && (
          <div>{savingError.message || "Failed to save road"}</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default RoadEdit;
