import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Find from "./Find";
import Design from "./Design";
import Activity from "./Activity";
import Profile from "./Profile";

const Tab = createBottomTabNavigator();

export default function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Find" component={Find} />
      <Tab.Screen name="Design" component={Design} />
      <Tab.Screen name="Activity" component={Activity} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
