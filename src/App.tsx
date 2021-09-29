import React from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { RoadEdit, RoadList } from "./todo";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { RoadProvider } from "./todo/roadProvider";

const App: React.FC = () => (
  <IonApp>
    <RoadProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/roads" component={RoadList} exact={true} />
          <Route path="/road" component={RoadEdit} exact={true} />
          <Route path="/road/:id" component={RoadEdit} exact={true} />
          <Redirect to="/roads" />
        </IonRouterOutlet>
      </IonReactRouter>
    </RoadProvider>
  </IonApp>
);

export default App;
