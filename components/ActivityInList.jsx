import { View, Text, Image, StyleSheet, Linking } from "react-native";
import React from "react";
import { auth } from "../Firebase/firebase-setup";
import PressableButton from "./PressableButton";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import Card from "../components/Card";
import PlayerTagInActivity from "./PlayerTagInActivity";
import ParticipantList from "./ParticipantList";
import ActivityReminder from "./ActivityReminder";

export default function ActivityInList({
  activity,
  players,
  editHandler,
  deleteHandler,
  joinHandler,
  leaveHandler,
}) {
  const organizer = players.find((player) => player.id === activity.organizer);
  const participants = players.filter((player) =>
    activity.participants.includes(player.id)
  );

  const dateFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    timeZoneName: "short",
  };

  const secondDiff = () => {
    const now = new Date();
    const secondDiff = Math.floor((activity.date - now) / 1000) - 86400;
    if (secondDiff > 0) {
      return secondDiff;
    } else {
      return 5;
    }
  };

  function navigationHandler() {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${organizer.location.latitude},${organizer.location.longitude}`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        console.log(`Cannot open URL: ${url}`);
      }
    });
  }

  return (
    <View>
      <View style={styles.card}>
        <Card width={340} height={420} backgroundColor={colors.whiteWords}>
          {!activity.usersToRemind.includes(auth.currentUser.uid) && (
            <ActivityReminder
              activityTitle={activity.title}
              organizerName={organizer.name}
              activityId={activity.id}
              triggerSeconds={secondDiff()}
            />
          )}
          <Text>Title: {activity.title}</Text>
          <Image
            style={{ width: 200, height: 200 }}
            source={{ uri: activity.imageUri }}
          />
          <Text>Introduction: {activity.intro}</Text>
          <Text>
            Date: {activity.date.toLocaleString(undefined, dateFormatOptions)}
          </Text>
          <PressableButton onPress={navigationHandler}>
            <Text>
              {"<"}Go There{">"}
            </Text>
          </PressableButton>
          <View style={styles.playerTagWrapper}>
            <Text>organizer:</Text>
            <PlayerTagInActivity player={organizer} isInFlatList={false} />
          </View>
          <Text>participants: {activity.participants.length}</Text>
          <View style={styles.playerTagListWrapper}>
            <ParticipantList participants={participants} />
          </View>
        </Card>
      </View>

      {activity.organizer === auth.currentUser.uid ? (
        <>
          <View style={styles.buttons}>
            <PressableButton
              defaultStyle={styles.editNameDefaultStyle}
              pressedStyle={styles.editNamePressedStyle}
              onPress={() => {
                editHandler(activity);
              }}
            >
              <View style={styles.editNameButton}>
                <AntDesign name="edit" size={24} color={colors.shadowColor} />
                <Text style={styles.inputDisplay}>Edit</Text>
              </View>
            </PressableButton>
            <PressableButton
              defaultStyle={styles.defaultStyle}
              pressedStyle={styles.pressedStyle}
              onPress={() => {
                deleteHandler(activity);
              }}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </PressableButton>
          </View>
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

const styles = StyleSheet.create({
  editNameButton: {
    flexDirection: "row",
    alignSelf: "center",
  },
  editNameDefaultStyle: {
    width: 150,
    height: 50,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 5,
    marginRight: 5,
  },
  editNamePressedStyle: {
    opacity: 0.5,
  },
  inputDisplay: {
    fontSize: 20,
    marginLeft: 5,
  },
  defaultStyle: {
    width: 150,
    height: 45,
    marginLeft: 5,

    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: colors.redButton,
    // Add platform-specific shadow
    ...Platform.select({
      ios: {
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  pressedStyle: {
    backgroundColor: colors.pressedRedButton,
    opacity: 0.5,
  },
  buttonText: {
    color: colors.whiteWords,
    fontSize: 20,
    alignSelf: "center",
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  card: {
    marginVertical: 10,
    alignSelf: "center",
  },
  playerTagWrapper: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    alignItems: "center",
  },
  playerTagListWrapper: {
    width: "100%",
    height: 50,
  },
});
