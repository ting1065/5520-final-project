import { View, Text, Alert, StyleSheet  } from "react-native";
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
import { colors } from '../Colors';

export default function Activity() {
  const [activities, setActivities] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activityAsOrganizer, setActivityAsOrganizer] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "activities"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const activitiesFromDB = querySnapshot.docs.map((activity) => {
          return { ...activity.data(), id: activity.id };
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
    const q = query(collection(db, "users"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const players = querySnapshot.docs.map((player) => player.data());
        setPlayers(players);
      } else {
        setPlayers([]);
      }
    });

    return () => unsubscribe();
  }, []);

  function editHandler(activity) {
    setEditingActivity(activity);
    setModalVisible(true);
  }

  async function confirmEditHandler(title, imageUri, intro) {
    if (!(title && imageUri && intro)) {
      Alert.alert("Please fill in all fields");
      return;
    }

    if (editingActivity) {
      await updateActivityInDB(editingActivity.id, title, imageUri, intro);
    } else {
      await addActivityToDB(title, imageUri, intro, auth.currentUser.uid);
    }

    setModalVisible(false);
    setEditingActivity(null);
  }

  function cancelEditHandler() {
    setEditingActivity(null);
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
      <View>
        {!activityAsOrganizer && (
          <>
            <Text>=======</Text>
            <PressableButton
              onPress={() => {
                setModalVisible(true);
              }}
            >
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
        />

        <Text style={styles.activityList}>Activity List</Text>

        <ActivityList
          activities={activities}
          players={players}
          editHandler={editHandler}
          deleteHandler={deleteHandler}
          joinHandler={joinHandler}
          leaveHandler={leaveHandler}
        />
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: '100%',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  activityList: {
    marginTop: 10,
    fontSize: 25,
    alignSelf: 'center',
  },
})