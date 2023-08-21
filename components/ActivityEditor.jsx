import { View, Text, Modal, TextInput, Image, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import ImageManager from "./ImageManager";
import { auth } from "../Firebase/firebase-setup";
import PressableButton from "./PressableButton";
import DatePicker from "./DatePicker";
import GradientBackground from "./GradientBackground";
const defaultCoverImage =
  "https://media.istockphoto.com/id/1085838082/vector/conference-room-meeting-icon.jpg?s=612x612&w=0&k=20&c=w2dyjVwYw-LDadgIFuRkvgMPBtljmsufgler8zcE288=";

export default function ActivityEditor({
  modalVisible,
  editingActivity,
  confirmEditHandler,
  cancelEditHandler,
  editorRefresher,
}) {
  const [title, setTitle] = useState(
    editingActivity ? editingActivity.title : ""
  );
  const [imageUri, setImageUri] = useState(
    editingActivity ? editingActivity.imageUri : defaultCoverImage
  );
  const [intro, setIntro] = useState(
    editingActivity ? editingActivity.intro : ""
  );
  const [startDate, setStartDate] = useState(
    editingActivity ? editingActivity.date : null
  );

  useEffect(() => {
    setTitle(editingActivity ? editingActivity.title : "");
    setImageUri(editingActivity ? editingActivity.imageUri : defaultCoverImage);
    setIntro(editingActivity ? editingActivity.intro : "");
    setStartDate(editingActivity ? editingActivity.date : null);
  }, [editingActivity, editorRefresher]);

  function confirmDateHandler(date) {
    setStartDate(date);
  }

  return (
    <Modal visible={modalVisible} animationType="slide">
      <GradientBackground>
        <View style={styles.container}>
          <Text>Title</Text>
          <TextInput
            autoCapitalize="none"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
            }}
          />
          <Text>Cover Image</Text>
          <Image style={{ width: 200, height: 200 }} source={{ uri: imageUri }} />
          <ImageManager
            storeDownloadUri={setImageUri}
            folderName="activities"
            fileName={auth.currentUser.uid}
          />
          <Text>introduction</Text>
          <TextInput
            autoCapitalize="none"
            value={intro}
            onChangeText={(text) => {
              setIntro(text);
            }}
          />
          <DatePicker
            confirmDateHandler={confirmDateHandler}
            initialDate={startDate}
            date={startDate}
          />
          <Text>===========</Text>
          <PressableButton
            onPress={async () => {
              await confirmEditHandler(title, imageUri, intro, startDate);
            }}
          >
            <Text>confirm</Text>
          </PressableButton>
          <Text>===========</Text>
          <Text>===========</Text>
          <PressableButton onPress={cancelEditHandler}>
            <Text>cancel</Text>
          </PressableButton>
          <Text>===========</Text>
        </View>
      </GradientBackground>

    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
