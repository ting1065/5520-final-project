import { View, Text, Image, StyleSheet, Alert, ImageBackground, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../Firebase/firebase-setup";
import { signOut } from "firebase/auth";
import PressableButton from "../components/PressableButton";
import { updateUserAvatarInDB } from "../Firebase/firebase-helper";
import UserNameEditor from "../components/UserNameEditor";
import ImageManager from "../components/ImageManager";
import { doc, onSnapshot } from "firebase/firestore";
import GradientBackground from "../components/GradientBackground";
import { colors } from "../styles/colors";
import Card from "../components/Card";
import { AntDesign } from "@expo/vector-icons";
import DeleteAccountBoard from "../components/DeleteAccountBoard";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const imageSize = Math.min(screenWidth * 0.4, screenHeight * 0.4);


export default function Profile() {
  const avatarStorageFolder = "avatars";
  const avatarFileName = auth.currentUser.uid;

  const [user, setUser] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "users", auth.currentUser.uid),
      (doc) => {
        setUser(doc.data());
      }
    );

    return () => unsubscribe();
  }, []);

  function hideModalHandler() {
    setModalVisible(false);
  }

  async function updateAvatarUri(uri) {
    await updateUserAvatarInDB(auth.currentUser.uid, uri);
  }

  function totallyDeleteUser() {
    Alert.alert("Are you sure?", "This action cannot be undone!", [
      {
        text: "Cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          setModalVisible(true);
        },
      },
    ]);
  }

  return (
    <GradientBackground>
      <View style={styles.container}>
        <DeleteAccountBoard
          modalVisible={modalVisible}
          hideModalHandler={hideModalHandler}
        />
        <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{ uri: user?.avatar }}
            />
            <ImageManager
            storeDownloadUri={updateAvatarUri}
            folderName={avatarStorageFolder}
            fileName={avatarFileName}
            />      
        </View>
        <View style={styles.cardContainer}>
          <Card width={300} height={200} backgroundColor={colors.whiteWords} >
            <Text style={styles.personalInfo}>Personal Info</Text>
            <Text style={styles.inputTitle}>Your name:</Text>
            <View style={styles.nameContainer}>
              {isEditingName ? (
                <UserNameEditor
                  currentName={user?.name}
                  confirmHandler={() => {
                    setIsEditingName(false);
                  }}
                  cancelHandler={() => setIsEditingName(false)}
                />
              ) : (
                <Text style={styles.inputDisplay}>{user?.name}</Text>
              )}
              {!isEditingName && (
                <PressableButton
                  defaultStyle={styles.editNameDefaultStyle}
                  pressedStyle={styles.editNamePressedStyle}
                  onPress={() => setIsEditingName(true)}
                >
                  <View style={styles.editNameButton}>
                    <AntDesign name="edit" size={24} color={colors.shadowColor} />
                    <Text style={styles.inputDisplay}> Edit </Text>
                  </View>
                </PressableButton>
              )}
            </View>
            <Text style={styles.inputTitle}>Your email:</Text>
            <Text style={styles.inputDisplay}>{user?.email}</Text>
          </Card>
        </View>
        <View style={styles.buttonsContainer}>
          <View >
            <PressableButton
              defaultStyle={styles.defaultStyle}
              pressedStyle={styles.pressedStyle}
              onPress={async () => {
                try {
                  await signOut(auth);
                } catch (error) {
                  console.log("error happened while logging out: ", error);
                }
              }}
            >
              <Text style={styles.loginButtonText}>Sign Out</Text>
            </PressableButton>
          </View>
            
          <View style={[{marginLeft: 20}]}>
            <PressableButton
              defaultStyle={styles.defaultStyle}
              pressedStyle={styles.pressedStyle}
              onPress={totallyDeleteUser}
            >
              <Text style={styles.loginButtonText}>Delete</Text>
            </PressableButton>
          </View>
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    
  },
  loginButtonText: {
    color: colors.whiteWords,
    fontSize: 20,
    alignSelf: "center",
  },
  defaultStyle: {
    width: 120,
    height: 45,
    marginTop: 20,
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
    marginVertical: 10,
  },
  
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  personalInfo: {
    fontSize: 25,
    alignSelf: "center",
  },
  inputTitle: {
    fontSize: 20,
    color: colors.greyWords,
    marginVertical: 10,
  },
  inputDisplay: {
    fontSize: 20,
  },
  editNameButton: {
    flexDirection: "row",
  },
  editNameDefaultStyle: {
    width: 80,
    height: 30,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginRight: 5,
  },
  editNamePressedStyle: {
    opacity: 0.5,
  },
  buttonsContainer: {
    flex: 0.5,
    flexDirection: 'row',
  },
  cardContainer: {
    flex: 1,
    marginVertical: 10,
    justifyContent: 'center',
  }
});
