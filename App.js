import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase/firebase-setup";
import Signup from "./screens/Signup";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Game from "./screens/Game";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    };
  },
});

const Stack = createNativeStackNavigator();

export default function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("notification received: ", notification);
      }
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (notification) => {
        console.log("notification response: ", notification);
        console.log("notification activityId: ", notification.notification.request.content.data.activityId);
      }
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsUserLoggedIn(true);
      } else {
        setIsUserLoggedIn(false);
      }
    });
  }, []);

  const AuthStack = (
    <>
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
    </>
  );

  const AppStack = (
    <>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Game"
        component={Game}
        options={() => {
          return {
            headerLeft: () => {
              return <></>;
            },
          };
        }}
      />
    </>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {isUserLoggedIn ? AppStack : AuthStack}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
