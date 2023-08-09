import { View, Text, Alert, Image } from "react-native";
import React, {useEffect, useState} from "react";
import { auth } from "../Firebase/firebase-setup";
import { signOut } from "firebase/auth";
import PressableButton from "../components/PressableButton";
import { getUserFromDB, updateUserAvatarInDB} from "../Firebase/firebase-helper";
import UserNameEditor from "../components/UserNameEditor";
import ImageManager from "../components/ImageManager";

export default function Profile() {

  const avatarStorageFolder = "avatars";
  const avatarFileName = auth.currentUser.uid;

  const [user, setUser] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [refreshHandler, setRefreshHandler] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchUser = async () => {
      if (active) {
        const userData = await getUserFromDB(auth.currentUser.uid);
        setUser(userData);
      }
    };

    fetchUser();

    return () => {
      active = false;
    };
  }, [refreshHandler]);

  async function updateAvatarUri(uri) {
    await updateUserAvatarInDB(auth.currentUser.uid, uri);
    setRefreshHandler(!refreshHandler);
  }

  console.log("user: ", user);

  return (
    <View>
      <Image style={{width:100, height:100,}} source={{uri: user?.avatar}}/>
      <ImageManager storeDownloadUri={updateAvatarUri} folderName={avatarStorageFolder} fileName={avatarFileName} />
      <Text>name:</Text>
      {isEditingName ? (<UserNameEditor currentName={user?.name} confirmHandler={() => {
        setIsEditingName(false);
        setRefreshHandler(!refreshHandler);
      }} cancelHandler={() => setIsEditingName(false)} />):(<Text>{user?.name}</Text>) }
      <PressableButton onPress={() => setIsEditingName(true)}>
        <Text>Edit Name</Text>
      </PressableButton>
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
        <Text>Sign Out</Text>
      </PressableButton>
    </View>
  );
}
