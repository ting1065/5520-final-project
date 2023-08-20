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

export default function Activity() {
  const [activities, setActivities] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activityAsOrganizer, setActivityAsOrganizer] = useState(null);
  const [editorRefresher, setEditorRefresher] = useState(false);

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
        date
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
            <Text>=======</Text>
            <PressableButton onPress={addHandler}>
              <Text>add activity</Text>
            </PressableButton>
            <Text>=======</Text>
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
          />
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  addButtonContainer: {
    flex: 1,
  },
  listContainer: {
    flex: 9,
  },
});
