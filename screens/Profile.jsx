import { View, Text, Alert } from "react-native";
import React from "react";
import { auth } from "../Firebase/firebase-setup";
import { signOut } from "firebase/auth";
import PressableButton from "../components/PressableButton";

export default function Profile() {
  return (
    <View>
      <Text>email: {auth.currentUser.email}</Text>
      <Text>uid: {auth.currentUser.uid}</Text>
      <PressableButton
        onPress={async () => {
          try {
            await signOut(auth);
          } catch (error) {
            console.log("error happened while logging out: ", error);
            Alert.alert("error happened while logging out: ", error);
          }
        }}
      >
        <Text>Sign Out</Text>
      </PressableButton>
    </View>
  );
}
