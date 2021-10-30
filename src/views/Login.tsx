import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
} from "@ionic/react";
import React from "react";

interface Props {}

const Login = (props: Props) => {
  return (
    <IonPage>
      <IonContent>
        <IonCard>
          <IonCardHeader>Login</IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput />
            </IonItem>

            <IonInput></IonInput>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Login;
