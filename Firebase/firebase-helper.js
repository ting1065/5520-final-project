import {
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    setDoc,
    getDoc,
  } from "firebase/firestore";
  import { db } from "./firebase-setup";

  const defaultAvatar = "https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/SpongeBob_SquarePants_character.svg/1200px-SpongeBob_SquarePants_character.svg.png";

  //users collection

  //add a new user to db
  export async function addUserToDB(id, email) {
    try {
      await setDoc(doc(db, "users", id), {
        email: email,
        name: "Anonymous",
        avatar: defaultAvatar,
        win: 0,
        lose: 0,
      });
    } catch (e) {
      console.error("Error happened while adding user to db: ", e);
    }
  }

  //read a user from db
  export async function getUserFromDB(id) {
    try {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
    } catch (e) {
      console.error("Error happened while getting user from db: ", e);
    }
  }

  //update a user's name in db
  export async function updateUserNameInDB(id, newName) {
    try {
      const docRef = doc(db, "users", id);
      await updateDoc(docRef, {
        name: newName,
      });
    } catch (e) {
      console.error("Error happened while updating user's name in db: ", e);
    }
  }


  //puzzles collection

  //activities collection