import { IonContent, IonPage, IonRouterOutlet, IonText } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import React, { useContext } from "react";
import { Route, Redirect } from "react-router";
import { RoadList, RoadEdit } from "./components";
import GuardedRoute from "./components/GuardedRoute";
import { AuthContext } from "./providers/authProvider";
import { RoadProvider } from "./providers/roadProvider";
import Login from "./views/Login";

interface Props {}

const Setup = (props: Props) => {
  const { authToken, retrieveingToken } = useContext(AuthContext);
  return (
    <IonReactRouter>
      <RoadProvider>
        <IonRouterOutlet>
          <GuardedRoute path="/roads" component={RoadList} exact />
          <GuardedRoute path="/road" component={RoadEdit} exact />
          <GuardedRoute path="/road/:id" component={RoadEdit} exact />
          <Route path="/login" component={Login} exact />
          <Redirect to="/roads" />
        </IonRouterOutlet>
      </RoadProvider>
    </IonReactRouter>
  );
};

export default Setup;
