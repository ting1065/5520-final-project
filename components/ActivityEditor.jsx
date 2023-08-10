import { View, Text, Modal, TextInput, Image, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import ImageManager from "./ImageManager";
import { auth } from "../Firebase/firebase-setup";
import PressableButton from "./PressableButton";

const defaultCoverImage =
  "https://media.istockphoto.com/id/1085838082/vector/conference-room-meeting-icon.jpg?s=612x612&w=0&k=20&c=w2dyjVwYw-LDadgIFuRkvgMPBtljmsufgler8zcE288=";

export default function ActivityEditor({
  modalVisible,
  editingActivity,
  confirmEditHandler,
  cancelEditHandler,
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

  useEffect(() => {
    setTitle(editingActivity ? editingActivity.title : "");
    setImageUri(editingActivity ? editingActivity.imageUri : defaultCoverImage);
    setIntro(editingActivity ? editingActivity.intro : "");
  }, [editingActivity]);

  return (
    <Modal visible={modalVisible} animationType="slide">
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
        <Text>===========</Text>
        <PressableButton
          onPress={async () => {
            await confirmEditHandler(title, imageUri, intro);
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
