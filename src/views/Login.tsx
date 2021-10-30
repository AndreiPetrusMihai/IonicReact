import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../providers/authProvider";

interface Props {}

const Login = (props: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { authToken, login, retrieveingToken } = useContext(AuthContext);
  const history = useHistory();
  console.log(authToken);

  useEffect(() => {
    if (authToken) {
      history.push("/roads");
    }
  }, [authToken]);

  if (retrieveingToken) {
    return (
      <IonPage>
        <IonContent>
          <IonText>Attempting Authentication</IonText>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent>
        <IonCard>
          <IonCardHeader>Login</IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput
                value={email}
                onIonChange={(e) => {
                  setEmail(e.detail.value!);
                }}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput
                value={password}
                onIonChange={(e) => {
                  setPassword(e.detail.value!);
                }}
              />
            </IonItem>
            <IonButton
              onClick={() => {
                login!(email, password);
              }}
            >
              Login
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Login;
