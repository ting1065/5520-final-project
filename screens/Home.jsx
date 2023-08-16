import { View, Text, TextInput, Alert, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Find from "./Find";
import Design from "./Design";
import Activity from "./Activity";
import Profile from "./Profile";
import { colors } from '../Colors';
import { FontAwesome5 } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function Home() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerStyle: { backgroundColor: colors.topheader },
        headerTintColor: colors.whiteWords,
        tabBarStyle: { 
          backgroundColor: colors.bottomheader,
          paddingBottom: 15,
          height: 70,
        },
        headerTitleAlign: 'center',
        tabBarActiveTintColor: colors.tabBarPressed,
        tabBarLabel: ({ focused }) => (
          <Text style={{ color: focused ? colors.tabBarPressed : colors.tabBarNotPressed}}>{route.name}</Text>
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
      <Tab.Screen name="Activity" component={Activity} />
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
  );
}