import { View, Text, Image } from "react-native";
import React from "react";
import { auth } from "../Firebase/firebase-setup";
import PressableButton from "./PressableButton";

export default function ActivityInList({
  activity,
  editHandler,
  deleteHandler,
  joinHandler,
  leaveHandler,
}) {
  return (
    <View>
      <Text>Title: {activity.title}</Text>
      <Image
        style={{ width: 200, height: 200 }}
        source={{ uri: activity.imageUri }}
      />
      <Text>Introduction: {activity.intro}</Text>
      <Text>organizer: {activity.oganizer}</Text>
      <Text>participant: {activity.participants.length}</Text>
      {activity.oganizer === auth.currentUser.uid ? (
        <>
          <Text>===========</Text>
          <PressableButton
            onPress={() => {
              editHandler(activity);
            }}
          >
            <Text>edit</Text>
          </PressableButton>
          <Text>===========</Text>
          <Text>===========</Text>
          <PressableButton
            onPress={() => {
              deleteHandler(activity);
            }}
          >
            <Text>delete</Text>
          </PressableButton>
          <Text>===========</Text>
        </>
      ) : activity.participants.includes(auth.currentUser.uid) ? (
        <>
          <Text>===========</Text>
          <PressableButton
            onPress={() => {
              leaveHandler(activity);
            }}
          >
            <Text>leave</Text>
          </PressableButton>
          <Text>===========</Text>
        </>
      ) : (
        <>
          <Text>===========</Text>
          <PressableButton
            onPress={() => {
              joinHandler(activity);
            }}
          >
            <Text>join</Text>
          </PressableButton>
          <Text>===========</Text>
        </>
      )}
    </View>
  );
}
