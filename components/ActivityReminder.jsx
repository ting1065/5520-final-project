import { Alert, StyleSheet } from "react-native";
import React from "react";
import * as Notifications from "expo-notifications";
import PressableButton from "./PressableButton";
import { auth } from "../Firebase/firebase-setup";
import { addUserToUsersToRemindInActivityInDB } from "../Firebase/firebase-helper";
import { colors } from "../styles/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ActivityReminder({
  activityTitle,
  organizerName,
  activityId,
  triggerSeconds,
}) {
  async function verifyPermission() {
    const permissionInfo = await Notifications.getPermissionsAsync();
    if (permissionInfo.granted === true) {
      return true;
    } else {
      const response = await Notifications.requestPermissionsAsync();
      return response.granted;
    }
  }

  const notificationHandler = async () => {
    const hasPermission = await verifyPermission();
    if (!hasPermission) {
      Alert.alert("You need to give access to notifications");
      return;
    } else {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Incoming Activity Reminder",
            body: `on-site activity '${activityTitle}' organized by '${organizerName}' is about to start.`,
            data: { activityId: activityId },
          },
          trigger: { seconds: triggerSeconds },
        });
        await addUserToUsersToRemindInActivityInDB(
          activityId,
          auth.currentUser.uid
        );
        Alert.alert(
          "Notification Scheduled",
          `You will be notified when the activity is about to start in 24h.\n\ni.e. ${triggerSeconds} seconds later.`
        );
      } catch (err) {
        console.log("error while scheduling notification", err);
      }
    }
  };

  return (
    <PressableButton
      defaultStyle={styles.reminderDefaultStyle}
      pressedStyle={styles.reminderPressedStyle}
      onPress={notificationHandler}
    >
      <MaterialCommunityIcons
        name="bell-ring-outline"
        size={24}
        color={colors.inactiveBell}
      />
    </PressableButton>
  );
}

const styles = StyleSheet.create({
  reminderDefaultStyle: {
    backgroundColor: colors.whiteWords,
    borderRadius: 10,
  },
  reminderPressedStyle: {
    backgroundColor: colors.activeBell,
  },
});
