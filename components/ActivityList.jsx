import { FlatList, StyleSheet } from "react-native";
import React, { useRef, useEffect } from "react";
import ActivityInList from "./ActivityInList";

export default function ActivityList({
  activities,
  players,
  editHandler,
  deleteHandler,
  joinHandler,
  leaveHandler,
  remindedActivityIndex,
  resetRemindedActivityIndex,
}) {
  const activityListRef = useRef(null);

  useEffect(() => {
    if (!remindedActivityIndex) {
      return;
    }
    activityListRef.current.scrollToIndex({
      index: remindedActivityIndex,
      animated: true,
      viewPosition: 0.5,
    });
    resetRemindedActivityIndex();
  }, [remindedActivityIndex]);

  return (
    <FlatList
      ref={activityListRef}
      data={activities}
      renderItem={({ item }) => (
        <ActivityInList
          activity={item}
          players={players}
          editHandler={editHandler}
          deleteHandler={deleteHandler}
          joinHandler={joinHandler}
          leaveHandler={leaveHandler}
        />
      )}
    />
  );
}