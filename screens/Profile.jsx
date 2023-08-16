import { View, Text, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../Firebase/firebase-setup";
import { signOut } from "firebase/auth";
import PressableButton from "../components/PressableButton";
import { updateUserAvatarInDB } from "../Firebase/firebase-helper";
import UserNameEditor from "../components/UserNameEditor";
import ImageManager from "../components/ImageManager";
import { doc, onSnapshot } from "firebase/firestore";
import GradientBackground from "../components/GradientBackground";
import { colors } from '../Colors';

export default function Profile() {
  const avatarStorageFolder = "avatars";
  const avatarFileName = auth.currentUser.uid;

  const [user, setUser] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "users", auth.currentUser.uid),
      (doc) => {
        setUser(doc.data());
      }
    );

    return () => unsubscribe();
  }, []);

  async function updateAvatarUri(uri) {
    await updateUserAvatarInDB(auth.currentUser.uid, uri);
  }

  return (
    <GradientBackground>
      <View style={styles.container}>
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
          
        <Text>name:</Text>
        {isEditingName ? (
          <UserNameEditor
            currentName={user?.name}
            confirmHandler={() => {
              setIsEditingName(false);
            }}
            cancelHandler={() => setIsEditingName(false)}
          />
        ) : (
          <Text>{user?.name}</Text>
        )}
        <Text>=======</Text>
        <PressableButton onPress={() => setIsEditingName(true)}>
          <Text>Edit Name</Text>
        </PressableButton>
        <Text>=======</Text>
        <Text>email: {user?.email}</Text>
        <Text>win: {user?.win}</Text>
        <Text>lose: {user?.lose}</Text>
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
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: colors.whiteWords,
    fontSize: 20,
    alignSelf: 'center',

  },
  defaultStyle: {
    width: 200,
    height: 45,
    marginTop: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: 'darkred',
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
    backgroundColor: 'red',
    opacity: 0.5,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,

    resizeMode: 'cover',
  },


});
