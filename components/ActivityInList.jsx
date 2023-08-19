import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { auth } from "../Firebase/firebase-setup";
import PressableButton from "./PressableButton";
import { AntDesign } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import Card from "../components/Card";
import PlayerTagInActivity from "./PlayerTagInActivity";

export default function ActivityInList({
  activity,
  players,
  editHandler,
  deleteHandler,
  joinHandler,
  leaveHandler,
}) {
  const organizer = players.find((player) => player.id === activity.organizer);
  return (
    <View>
      <View style={styles.card}>
        <Card
            width={340}
            height={400}
            backgroundColor={colors.whiteWords}
        >
          <Text>Title: {activity.title}</Text>
          <Image
            style={{ width: 200, height: 200 }}
            source={{ uri: activity.imageUri }}
          />
          <Text>Introduction: {activity.intro}</Text>
          <View style={styles.playerTagWrapper}>
            <Text>organizer:</Text>
            <PlayerTagInActivity player={organizer} />
          </View>
          <Text>participant: {activity.participants.length}</Text>
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
    flexDirection: 'row',
    alignSelf: 'center',
  },
  editNameDefaultStyle: {
    width: 150,
    height: 50,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
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

    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
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
    alignSelf: 'center',

  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  card: {
    marginVertical: 10,
    alignSelf: 'center',
  },
  playerTagWrapper: {
    flexDirection: 'row',
    width: "100%",
    height: 50,
    alignItems: 'center',
  },
})