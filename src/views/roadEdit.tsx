import React, { useContext, useEffect, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCheckbox,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonPage,
  IonRow,
} from "@ionic/react";
import { getLogger } from "../core";
import { RoadContext } from "../providers/roadProvider";
import { RouteComponentProps, useHistory } from "react-router";
import { RoadProps } from "../components/RoadProps";
import { usePhotoGallery } from "../utils/usePhotoGallery";
import { camera } from "ionicons/icons";

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
  const [base64Photo, setBase64Photo] = useState<string | null>(null);
  const { takePhoto, savePicture } = usePhotoGallery();

  const [road, setRoad] = useState<RoadProps>();
  const routeId = match.params.id || "";
  const correspondingRoad = [
    ...(roads || []),
    ...(localSavedRoads || []),
  ]?.find((it) => it.id === parseInt(routeId));

  const savePictureToDevice = () => {
    console.log({ base64Data: base64Photo, routeId });
    savePicture(base64Photo!, routeId || "");
  };

  const takePhotoForItem = () => {
    takePhoto().then((photo) => {
      if (photo.base64String) setBase64Photo(photo.base64String);
    });
  };

  useEffect(() => {
    setRoad(correspondingRoad);
    if (correspondingRoad) {
      setName(correspondingRoad.name);
      setLanes(correspondingRoad.lanes || 0);
      setBase64Photo(correspondingRoad.base64Photo || null);
      setLastMaintained(
        new Date(correspondingRoad.lastMaintained as any as string) || null
      );
      setIsOperational(correspondingRoad.isOperational || false);
    }
  }, [correspondingRoad?.id, correspondingRoad?.version]);

  const handleSave = () => {
    const editedRoad = road
      ? {
          ...road,
          name,
          lanes,
          isOperational,
          base64Photo: base64Photo || undefined,
        }
      : { name, lanes, isOperational, base64Photo: base64Photo || undefined };
    saveRoad && saveRoad(editedRoad).then(() => history.push("/roads"));
  };

  return (
    <IonCard>
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
      <IonRow>
        <IonButtons>
          <IonButton onClick={handleSave}>Save</IonButton>
        </IonButtons>
        <IonButtons>
          <IonButton onClick={() => history.push("/roads")}>Back</IonButton>
        </IonButtons>
      </IonRow>
      <IonRow>
        <IonButtons>
          <IonButton onClick={takePhotoForItem}>Take Photo</IonButton>
        </IonButtons>
        {base64Photo && (
          <IonButtons>
            <IonButton onClick={savePictureToDevice}>Save Photo</IonButton>
          </IonButtons>
        )}
        {base64Photo && (
          <IonButtons>
            <IonButton onClick={() => setBase64Photo(null)}>
              Clear Photo
            </IonButton>
          </IonButtons>
        )}
      </IonRow>

      {base64Photo && <IonImg src={"data:image/jpeg;base64," + base64Photo} />}

      <IonLoading isOpen={saving} />
      {savingError && <div>{savingError.message || "Failed to save road"}</div>}
    </IonCard>
  );
};

export default RoadEdit;
