import { View, Text } from "react-native";
import React, { Alert } from "react";
import * as ImagePicker from "expo-image-picker";
import PressableButton from "./PressableButton";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../Firebase/firebase-setup";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ImageManager({
  storeDownloadUri,
  folderName,
  fileName,
}) {
  const [permissionInfo, requestPermission] =
    ImagePicker.useCameraPermissions();

  async function verifyPermission() {
    if (permissionInfo.granted === true) {
      return true;
    } else {
      const response = await requestPermission();
      return response.granted;
    }
  }

  async function takeImageHandler() {
    try {
      const hasPermission = await verifyPermission();

      if (!hasPermission) {
        Alert.alert("You need to give access to camera");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
      });

      if (!result.canceled) {
        const localUri = result.assets[0].uri;
        const response = await fetch(localUri);
        const imageBlob = await response.blob();
        const imageRef = await ref(storage, `${folderName}/${fileName}`);
        const uploadResult = await uploadBytesResumable(imageRef, imageBlob);

        if (uploadResult.state === "success") {
          const downloadUrl = await getDownloadURL(imageRef);
          await storeDownloadUri(downloadUrl);
        }
      }
    } catch (error) {
      console.log("error happened while taking a picture:", error);
    }
  }

  return (
    <View>
      <PressableButton onPress={() => takeImageHandler()}>
        <MaterialCommunityIcons name="camera-retake" size={30} color="black" />
      </PressableButton>
    </View>
  );
}
