import {
    View,
    Text,
    TextInput,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Modal,
  } from "react-native";
  import React, { useState } from "react";
  import PressableButton from "./PressableButton";
  import { auth } from "../Firebase/firebase-setup";
  import Card from "./Card";
  import { colors } from "../styles/colors";
  import { AntDesign } from "@expo/vector-icons";
  import { Ionicons } from "@expo/vector-icons";
  import GradientBackground from "./GradientBackground";
  import {
    deleteUserFromDB,
    deletePuzzleFromDB,
    deleteActivityFromDB,
    deleteUserAvatarImageFromStorage,
    deleteUserActivityImageFromStorage,
    deleteUserAccount,
    getPuzzleFromDB,
    getActivityFromDB,
  } from "../Firebase/firebase-helper";
  import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
  
  export default function DeleteAccountBoard({ modalVisible, hideModalHandler }) {
    const [password, setPassword] = useState("");

    async function deleteAccountHandler() {

      if (!password || password.length < 6) {
        Alert.alert("Please enter a valid password");
        return;
      }

      //reauthenticate user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );
      try {
        await reauthenticateWithCredential(auth.currentUser, credential);
      } catch (error) {
        Alert.alert("Wrong password!");
        return;
      }

      Alert.alert(
        "Are you sure?",
        "This action is irreversible. All your data will be deleted.",
        [
          {
            text: "Cancel",
          },
          {
            text: "Delete",
            onPress: async() => {
              hideModalHandler();
              await implementDelete();
            },
          },
        ]
      );
    }
    
    async function implementDelete() {
      //delete puzzle
      const puzzle = await getPuzzleFromDB(auth.currentUser.uid);
      if (puzzle?.id) {
        await deletePuzzleFromDB(puzzle.id);
      }

      //delete activity
      const activity = await getActivityFromDB(auth.currentUser.uid);
      if (activity?.id) {
        await deleteActivityFromDB(activity.id);
      }

      //user's avatar and activity images in storage
      await deleteUserAvatarImageFromStorage(auth.currentUser.uid);
      await deleteUserActivityImageFromStorage(auth.currentUser.uid);

      //delete user from db
      await deleteUserFromDB(auth.currentUser.uid);

      //delete user account
      await deleteUserAccount();
    }

    function cancelHandler() {
      setPassword("");
      hideModalHandler();
    }
  
    return (
      <Modal visible={modalVisible} animationType="slide">
      <GradientBackground>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Text style={styles.appName}>Don't Go!</Text>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomesmallWrods}>
              Enter your password to confirm deleting your account
            </Text>
          </View>
  
          <Card width={300} height={360} backgroundColor={colors.whiteWords}>
            <AntDesign name="user" size={24} style={styles.user} />
  
            <Text style={styles.inputTitle}>Password</Text>
            <View style={styles.inputContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="ios-lock-closed-outline" size={24} />
              </View>
              <TextInput
                autoCapitalize="none"
                secureTextEntry={true}
                value={password}
                onChangeText={(newText) => setPassword(newText)}
                style={styles.textInput}
              />
            </View>
            <PressableButton
              defaultStyle={styles.defaultStyle}
              pressedStyle={styles.pressedStyle}
              onPress={deleteAccountHandler}
            >
              <Text style={styles.loginButtonText}>Confirm</Text>
            </PressableButton>
            <PressableButton
              defaultStyle={styles.defaultStyle}
              pressedStyle={styles.pressedStyle}
              onPress={cancelHandler}
            >
              <Text style={styles.loginButtonText}>Cancel</Text>
            </PressableButton>
          </Card>

        </KeyboardAvoidingView>
      </GradientBackground>
      </Modal>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    welcomeContainer: {
      width: 300,
      alignSelf: "center",
      marginBottom: 40,
    },
    welcomeBigWrods: {
      fontSize: 30,
      color: colors.whiteWords,
    },
    welcomesmallWrods: {
      color: colors.whiteWords,
    },
    appName: {
      fontSize: 45,
      color: colors.appName,
      marginBottom: 20,
      fontFamily: Platform.OS === "ios" ? "Cochin" : "Roboto",
      fontWeight: "bold",
    },
    inputTitle: {
      fontSize: 20,
      marginVertical: 20,
    },
    textInput: {
      fontSize: 20,
      height: 40,
      width: "90%",
      paddingLeft: 5,
    },
    user: {
      marginTop: 10,
      alignSelf: "center",
    },
    inputContainer: {
      flexDirection: "row",
      backgroundColor: colors.inputBackground,
      borderRadius: 5,
    },
    iconContainer: {
      marginHorizontal: 5,
      marginTop: 8,
    },
    loginButtonText: {
      color: colors.whiteWords,
      fontSize: 20,
      alignSelf: "center",
    },
    defaultStyle: {
      width: 200,
      height: 45,
      marginTop: 30,
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 5,
      backgroundColor: colors.loginButton,
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
      backgroundColor: colors.pressedLoginButton,
      opacity: 0.5,
    },
    bottomContainer: {
      marginTop: 30,
      flexDirection: "row",
    },
    pressedStyleBottom: {
      opacity: 0.2,
    },
    createAccountText: {
      color: colors.redWords,
    },
  });