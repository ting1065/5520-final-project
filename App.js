import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase/firebase-setup";
import Signup from "./screens/Signup";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Game from "./screens/Game";
import PressableButton from "./components/PressableButton";

const Stack = createNativeStackNavigator();

export default function App() {

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

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
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Login" component={Login} />
    </>
  );

  const AppStack = (
    <>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Game" component={Game} options={({ navigation }) => {
          return {
            headerRight: () => {
              return (
                <PressableButton onPress={() => navigation.replace("Home")}>
                  <Text>quit</Text>
                </PressableButton>
              );
            },
          };
        }}/>
    </>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {isUserLoggedIn ? AppStack : AuthStack}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
