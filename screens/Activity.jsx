import { View, Text, Alert, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import PressableButton from "../components/PressableButton";
import ActivityList from "../components/ActivityList";
import { auth, db } from "../Firebase/firebase-setup";
import { collection, onSnapshot, query } from "firebase/firestore";
import ActivityEditor from "../components/ActivityEditor";
import {
  addActivityToDB,
  updateActivityInDB,
  addParticipantToActivityInDB,
  removeParticipantFromActivityInDB,
  deleteActivityFromDB,
} from "../Firebase/firebase-helper";
import GradientBackground from "../components/GradientBackground";
import { usePlayers } from "../contexts/PlayersContext";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../styles/colors";

export default function Activity({ route }) {
  const [activities, setActivities] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activityAsOrganizer, setActivityAsOrganizer] = useState(null);
  const [editorRefresher, setEditorRefresher] = useState(false);
  const [remindedActivityIndex, setRemindedActivityIndex] = useState(null);

  const { players } = usePlayers();
  const currentUser = players.find(
    (player) => player.id === auth.currentUser.uid
  );

  useEffect(() => {
    const q = query(collection(db, "activities"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const activitiesFromDB = querySnapshot.docs.map((activity) => {
          return {
            ...activity.data(),
            date: activity.data().date.toDate(),
            id: activity.id,
          };
        });

        const activitiesAsOrganizer = activitiesFromDB.filter(
          (activity) => activity.organizer === auth.currentUser.uid
        );

        if (activitiesAsOrganizer.length > 0) {
          setActivityAsOrganizer(activitiesAsOrganizer[0]);
          const activitiesNotAsOrganizer = activitiesFromDB.filter(
            (activity) => activity.organizer !== auth.currentUser.uid
          );
          setActivities([
            ...activitiesAsOrganizer,
            ...activitiesNotAsOrganizer,
          ]);
        } else {
          setActivityAsOrganizer(null);
          setActivities(activitiesFromDB);
        }
      } else {
        setActivityAsOrganizer(null);
        setActivities([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (route.params?.remindedActivityId) {
      const index = activities.findIndex(
        (activity) => activity.id === route.params.remindedActivityId
      );
      if (!index) {
        setRemindedActivityIndex(-1);
      }
      setRemindedActivityIndex(index);
    }
  }, [route]);

  function resetRemindedActivityIndex() {
    setRemindedActivityIndex(null);
  }

  function addHandler() {
    if (!currentUser.location) {
      Alert.alert(
        "No Base Location",
        "Set your base location in 'Find' before posting an activity."
      );
      return;
    }
    setModalVisible(true);
  }

  function editHandler(activity) {
    setEditingActivity(activity);
    setModalVisible(true);
  }

  async function confirmEditHandler(title, imageUri, intro, date) {
    if (editingActivity && date < editingActivity.date) {
      Alert.alert("You can only change the starting time LATER.");
      return;
    }

    if (!(title && imageUri && intro && date)) {
      Alert.alert("Please fill in all fields");
      return;
    }

    if (editingActivity) {
      await updateActivityInDB(
        editingActivity.id,
        title,
        imageUri,
        intro,
        date,
        editingActivity.date === date ? editingActivity.usersToRemind : []
      );
    } else {
      await addActivityToDB(title, imageUri, intro, auth.currentUser.uid, date);
    }

    setModalVisible(false);
    setEditingActivity(null);
  }

  function cancelEditHandler() {
    setEditingActivity(null);
    setEditorRefresher(!editorRefresher);
    setModalVisible(false);
  }

  async function deleteHandler(activity) {
    Alert.alert(
      "Delete Activity",
      "Are you sure you want to delete this activity?",
      [
        {
          text: "Cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            await deleteActivityFromDB(activity.id);
            setEditorRefresher(!editorRefresher);
          },
        },
      ]
    );
  }

  async function joinHandler(activity) {
    await addParticipantToActivityInDB(activity.id, auth.currentUser.uid);
  }

  async function leaveHandler(activity) {
    await removeParticipantFromActivityInDB(activity.id, auth.currentUser.uid);
  }

  return (
    <GradientBackground>
      <View style={styles.addButtonContainer}>
        {!activityAsOrganizer && (
          <>
            
            <PressableButton 
              defaultStyle={styles.editNameDefaultStyle}
              pressedStyle={styles.editNamePressedStyle}
              onPress={addHandler}>
              <View style={styles.editNameButton}>
                <AntDesign
                  name="edit"
                  size={24}
                  color={colors.shadowColor}
                />
                <Text style={styles.inputDisplay}>Add/Update Activity</Text>
              </View>
            </PressableButton>
            
          </>
        )}
        <ActivityEditor
          modalVisible={modalVisible}
          editingActivity={editingActivity}
          confirmEditHandler={confirmEditHandler}
          cancelEditHandler={cancelEditHandler}
          editorRefresher={editorRefresher}
        />
        <View style={styles.listContainer}>
          <ActivityList
            activities={activities}
            players={players}
            editHandler={editHandler}
            deleteHandler={deleteHandler}
            joinHandler={joinHandler}
            leaveHandler={leaveHandler}
            remindedActivityIndex={remindedActivityIndex}
            resetRemindedActivityIndex={resetRemindedActivityIndex}
          />
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  addButtonContainer: {
    flex: 1,
    paddingTop: 20,
  },
  listContainer: {
    flex: 9,
  },
  editNameButton: {
    flexDirection: "row",
    alignSelf: "center",
  },
  editNameDefaultStyle: {
    width: 220,
    height: 50,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 20,
  },
  editNamePressedStyle: {
    opacity: 0.5,
  },
  inputDisplay: {
    fontSize: 20,
    marginLeft: 5,
  },
});
