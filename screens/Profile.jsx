import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../Firebase/firebase-setup";
import { signOut } from "firebase/auth";
import PressableButton from "../components/PressableButton";
import { updateUserAvatarInDB } from "../Firebase/firebase-helper";
import UserNameEditor from "../components/UserNameEditor";
import ImageManager from "../components/ImageManager";
import { doc, onSnapshot } from "firebase/firestore";

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
    <View>
      <Image
        style={{ width: 100, height: 100 }}
        source={{ uri: user?.avatar }}
      />
      <ImageManager
        storeDownloadUri={updateAvatarUri}
        folderName={avatarStorageFolder}
        fileName={avatarFileName}
      />
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
        onPress={async () => {
          try {
            await signOut(auth);
          } catch (error) {
            console.log("error happened while logging out: ", error);
          }
        }}
      >
        <Text>=======</Text>
        <Text>Sign Out</Text>
        <Text>=======</Text>
      </PressableButton>
    </View>
  );
}
