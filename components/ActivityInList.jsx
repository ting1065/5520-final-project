import {
  View,
  Text,
  Image,
  StyleSheet,
  Linking,
  ScrollView,
  TextInput,
} from "react-native";
import React from "react";
import { auth } from "../Firebase/firebase-setup";
import PressableButton from "./PressableButton";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import Card from "../components/Card";
import PlayerTagInActivity from "./PlayerTagInActivity";
import ParticipantList from "./ParticipantList";
import ActivityReminder from "./ActivityReminder";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";

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
        <Card width={340} height={600} backgroundColor={colors.whiteWords}>
          <View style={styles.headerButtonWrapper}>
            <View style={styles.headerLeftButtonWrapper}>
              {activity.usersToRemind.includes(auth.currentUser.uid) ? (
                <MaterialCommunityIcons
                  name="bell-ring"
                  size={24}
                  color={colors.activeBell}
                />
              ) : (
                <ActivityReminder
                  activityTitle={activity.title}
                  organizerName={organizer.name}
                  activityId={activity.id}
                  triggerSeconds={secondDiff()}
                />
              )}
            </View>
            <View style={styles.headerRightButtonWrapper}>
              <PressableButton
                defaultStyle={styles.goDefaultStyle}
                pressedStyle={styles.goPressedStyle}
                onPress={navigationHandler}
              >
                <Fontisto
                  name="navigate"
                  size={24}
                  color={colors.inactiveBell}
                />
              </PressableButton>
            </View>
          </View>
          {/* Title */}
          <Text style={styles.eventTitle}>{activity.title}</Text>
          <Image
            style={[
              { width: 150, height: 150 },
              { alignSelf: "center" },
              { marginVertical: 5 },
            ]}
            source={{ uri: activity.imageUri }}
          />
          <View style={styles.introWrapper}>
            <Text style={styles.boldText}>Introduction:</Text>
            <ScrollView
              style={styles.introTextContainer}
              contentContainerStyle={styles.introTextContentContainer}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.introText}>{activity.intro}</Text>
            </ScrollView>
          </View>
          <View style={styles.dateWrapper}>
            <Text style={styles.boldText}>Date:</Text>
            <Text>
              {" "}
              {activity.date.toLocaleString(undefined, dateFormatOptions)}
            </Text>
          </View>
          <View style={styles.playerTagWrapper}>
            <Text style={styles.boldText}>Organizer:</Text>
            <PlayerTagInActivity player={organizer} isInFlatList={false} />
          </View>
          <Text style={styles.boldText}>
            Participants: {activity.participants.length}
          </Text>
          <View style={styles.playerTagListWrapper}>
            <ParticipantList participants={participants} />
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
                    <AntDesign
                      name="edit"
                      size={24}
                      color={colors.shadowColor}
                    />
                    <Text style={styles.editText}>Edit</Text>
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
            <View style={styles.buttons}>
              <PressableButton
                defaultStyle={styles.defaultStyle}
                pressedStyle={styles.pressedStyle}
                onPress={() => {
                  leaveHandler(activity);
                }}
              >
                <Text style={styles.buttonText}>leave</Text>
              </PressableButton>
            </View>
          ) : (
            <View style={styles.buttons}>
              <PressableButton
                defaultStyle={styles.joindefaultStyle}
                pressedStyle={styles.pressedStyle}
                onPress={() => {
                  joinHandler(activity);
                }}
              >
                <Text style={styles.buttonText}>join</Text>
              </PressableButton>
            </View>
          )}
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  editNameButton: {
    flexDirection: "row",
  },
  editNameDefaultStyle: {
    width: 150,
    height: 50,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
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
    marginVertical: 5,
  },
  playerTagListWrapper: {
    width: "100%",
    height: 50,
    marginVertical: 5,
  },
  joindefaultStyle: {
    width: 150,
    height: 45,
    marginLeft: 5,

    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: colors.shadowColor,
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
  introWrapper: {
    width: "100%",
    marginVertical: 5,
  },
  introTextContainer: {
    backgroundColor: colors.scrollBackground,
    borderWidth: 1,
    borderColor: colors.greyWords,
    marginVertical: 5,
    height: 70,
    width: "100%",
  },
  introTextContentContainer: {
    alignItems: "center",
  },
  introText: {
    flex: 1,
    width: "98%",
    fontSize: 15,
    textAlign: "justify",
  },
  eventTitle: {
    fontSize: 25,
    alignSelf: "center",
  },
  goDefaultStyle: {
    backgroundColor: colors.whiteWords,
    borderRadius: 10,
  },
  goPressedStyle: {
    backgroundColor: colors.blueButton,
  },
  editText: {
    color: colors.shadowColor,
    fontSize: 20,
    marginLeft: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
  dateWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 5,
  },
  headerButtonWrapper: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    alignItems: "center",
  },
  headerLeftButtonWrapper: {
    flex: 1,
    alignItems: "flex-start",
    paddingLeft: "5%",
  },
  headerRightButtonWrapper: {
    flex: 1,
    alignItems: "flex-end",
    paddingRight: "5%",
  },
});
