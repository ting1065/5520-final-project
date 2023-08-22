import { View, Text, Modal, TextInput, Image, StyleSheet, KeyboardAvoidingView } from "react-native";
import React, { useState, useEffect } from "react";
import ImageManager from "./ImageManager";
import { auth } from "../Firebase/firebase-setup";
import PressableButton from "./PressableButton";
import DatePicker from "./DatePicker";
import GradientBackground from "./GradientBackground";
import { colors } from "../styles/colors";

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
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          
          <Text style={styles.inputTitle}>Cover Image</Text>
          <View style={styles.imageContainer}>
            
            <Image  style={styles.image} source={{ uri: imageUri }} />
            <ImageManager
              storeDownloadUri={setImageUri}
              folderName="activities"
              fileName={auth.currentUser.uid}
            />
          </View>
          <Text style={styles.inputTitle}>Title</Text>
          <TextInput
            autoCapitalize="none"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
            }}
            style={styles.titleInput}
          /> 
          <Text style={styles.inputTitle}>Introduction</Text>
          <TextInput
            autoCapitalize="none"
            value={intro}
            onChangeText={(text) => {
              setIntro(text);
            }}
            style={styles.introInput}
            multiline={true}
            blurOnSubmit={true}
          />
          <DatePicker
            confirmDateHandler={confirmDateHandler}
            initialDate={startDate}
            date={startDate}
          />
          <View style={styles.buttons}>
            <PressableButton
              defaultStyle={styles.defaultStyle}
              pressedStyle={styles.pressedStyle}
              onPress={async () => {
                await confirmEditHandler(title, imageUri, intro, startDate);
              }}
            >
              <Text style={styles.loginButtonText}>confirm</Text>
            </PressableButton>

            <PressableButton 
              defaultStyle={styles.defaultStyle}
              pressedStyle={styles.pressedStyle}
              onPress={cancelEditHandler}>
              <Text style={styles.loginButtonText}>cancel</Text>
            </PressableButton>
          </View>  
        </KeyboardAvoidingView>
      </GradientBackground>

    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: colors.whiteWords,

    resizeMode: "cover",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 20,
  },
  inputTitle: {
    fontSize: 20,
    color: colors.greyWords,
    marginVertical: 5,
  },
  titleInput: {
    fontSize: 20,
    width: '80%',
    borderWidth: 2,
    borderColor: colors.tabBarNotPressed,
    borderRadius: 5,
    paddingLeft: 5,
    height: 35,
  },
  introInput: {
    fontSize: 20,
    width: '80%',
    borderWidth: 2,
    borderColor: colors.tabBarNotPressed,
    borderRadius: 5,
    paddingLeft: 5,
    height: "20%",
  },
  loginButtonText: {
    color: colors.whiteWords,
    fontSize: 20,
    alignSelf: "center",
  },
  defaultStyle: {
    width: 120,
    height: 45,
    marginHorizontal: 10,
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
    backgroundColor: colors.pressedRedButton,
    opacity: 0.5,
  },
  buttons: {
    flexDirection: 'row',
    flex: 4,
  }

});
