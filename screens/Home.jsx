import { Text } from "react-native";
import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Find from "./Find";
import Design from "./Design";
import Activity from "./Activity";
import Profile from "./Profile";
import { colors } from "../styles/colors";
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import PlayersProvider from "../contexts/PlayersContext";
import * as Notifications from "expo-notifications";

const Tab = createBottomTabNavigator();

export default function Home({ navigation }) {
  // take the user to the activity screen when the user clicks on the notification
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (notification) => {
        navigation.navigate("Activity", {
          remindedActivityId:
            notification.notification.request.content.data.activityId,
        });
      }
    );
    return () => subscription.remove();
  }, []);

  return (
    <PlayersProvider>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: colors.topheader },
          headerTintColor: colors.whiteWords,
          tabBarStyle: {
            backgroundColor: colors.bottomheader,
            paddingBottom: 15,
            height: 70,
          },
          headerTitleAlign: "center",
          tabBarActiveTintColor: colors.tabBarPressed,
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? colors.tabBarPressed : colors.tabBarNotPressed,
              }}
            >
              {route.name}
            </Text>
          ),
        })}
      >
        <Tab.Screen
          name="Find"
          component={Find}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="users" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Design"
          component={Design}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="pencil-ruler" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Activity"
          component={Activity}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="activity" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="user-circle" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </PlayersProvider>
  );
}
