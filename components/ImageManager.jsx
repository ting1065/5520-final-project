import { View, StyleSheet, Alert } from "react-native";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import PressableButton from "./PressableButton";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../Firebase/firebase-setup";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ImageManager({
  storeDownloadUri,
  folderName,
  fileName,
}) {
  const [cameraPermissionInfo, requestCameraPermission] =
    ImagePicker.useCameraPermissions();
  const [photoPermissionInfo, requestPhotoPermission] =
    ImagePicker.useMediaLibraryPermissions();

  async function verifyCameraPermission() {
    if (cameraPermissionInfo.granted === true) {
      return true;
    } else {
      const response = await requestCameraPermission();
      return response.granted;
    }
  }

  async function verifyPhotoPermission() {
    if (photoPermissionInfo.granted === true) {
      return true;
    } else {
      const response = await requestPhotoPermission();
      return response.granted;
    }
  }

  async function uploadImageHandler(imagePickerResult) {
    if (!imagePickerResult.canceled) {
      const localUri = imagePickerResult.assets[0].uri;
      const response = await fetch(localUri);
      const imageBlob = await response.blob();
      const imageRef = ref(storage, `${folderName}/${fileName}`);
      const uploadResult = await uploadBytesResumable(imageRef, imageBlob);

      if (uploadResult.state === "success") {
        const downloadUrl = await getDownloadURL(imageRef);
        await storeDownloadUri(downloadUrl);
      }
    }
  }

  async function takeImageHandler() {
    try {
      Alert.alert("Image Source", "Where do you want to take the image from?", [
        {
          text: "Camera",
          onPress: async () => {
            const hasPermission = await verifyCameraPermission();

            if (!hasPermission) {
              Alert.alert("You need to give access to camera");
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
            });

            await uploadImageHandler(result);
          },
        },
        {
          text: "Library",
          onPress: async () => {
            const hasPermission = await verifyPhotoPermission();

            if (!hasPermission) {
              Alert.alert("You need to give access to photo library");
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });

            await uploadImageHandler(result);
          },
        },
        {
          text: "Cancel",
        },
      ]);
    } catch (error) {
      console.log("error happened while taking a picture:", error);
    }
  }

  return (
    <View style={styles.editButton}>
      <PressableButton
        defaultStyle={styles.defaultStyle}
        pressedStyle={styles.pressedStyle}
        onPress={() => takeImageHandler()}
      >
        <MaterialCommunityIcons name="camera-retake" size={30} color="black" />
      </PressableButton>
    </View>
  );
}

const styles = StyleSheet.create({
  editButton: {
    width: 50,
    height: 50,
    borderRadius: 50,
    position: "absolute",
    bottom: 0,
    right: -5,
    backgroundColor: "white",
    padding: 10,
  },
  defaultStyle: {},
  pressedStyle: {
    opacity: 0.5,
  },
});
