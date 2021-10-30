import React from "react";
import { IonItem, IonLabel } from "@ionic/react";
import { RoadProps } from "./RoadProps";

interface RoadPropsExt extends RoadProps {
  onEdit: (id?: string) => void;
}

const Road: React.FC<RoadPropsExt> = ({ id, name, onEdit }) => {
  return (
    <IonItem onClick={() => onEdit(id)}>
      <IonLabel>{name}</IonLabel>
    </IonItem>
  );
};

export default Road;
