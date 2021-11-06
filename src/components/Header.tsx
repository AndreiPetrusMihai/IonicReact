import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import React, { useContext } from "react";
import { useRouteMatch } from "react-router";
import { NetworkContext } from "../providers/networkProvider";

interface Props {}

const Header = (props: Props) => {
  const { networkStatus } = useContext(NetworkContext);
  const match = useRouteMatch(["/road/:id", "/roads", "/login"]);

  const getHeaderTitle = () => {
    switch (match?.path || "") {
      case "/roads":
        return "Roads Manager";
      case "/login":
        return "Welcome to Road Manager!";
      case "/road/:id":
        return "Edit";
      default:
        return "You seem lost";
    }
  };

  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>
          <IonGrid>
            <IonRow>
              <IonCol>{getHeaderTitle()}</IonCol>
              <IonCol className="ion-text-end">
                {networkStatus.connected ? "Connected" : "Disconnected"}
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
