import { View, Text, Alert, StyleSheet  } from "react-native";
import React from "react";
import * as Notifications from "expo-notifications";
import PressableButton from "./PressableButton";
import { auth } from "../Firebase/firebase-setup";
import { addUserToUsersToRemindInActivityInDB } from "../Firebase/firebase-helper";
import { colors } from "../styles/colors";

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
    <View style={styles.container}>
      <PressableButton 
        defaultStyle={styles.reminderDefaultStyle}
        pressedStyle={styles.reminderPressedStyle} 
        onPress={notificationHandler}
      >
        <View style={styles.reminderInnerContainer}>

          <Text style={styles.inputDisplay}>{"<"}Remind Me{">"}</Text>
        </View>
          
      </PressableButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',

  },
  reminderInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderDefaultStyle: {
    backgroundColor: colors.tabBarPressed,
    width: 250,
    height: 25,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  reminderPressedStyle: {
    opacity: 0.5,
  },
  inputDisplay: {
    color: colors.whiteWords,
    fontSize: 15,
  },

})