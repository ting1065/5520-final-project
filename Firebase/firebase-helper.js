import {
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    setDoc,
    getDoc,
    where,
    query,
    getDocs,
  } from "firebase/firestore";
  import { db } from "./firebase-setup";
  import { getRandomImageFromNASA } from "../external-api/helper";

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
        id: id,
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

  //update a user's avatar in db
  export async function updateUserAvatarInDB(id, newAvatarUri) {
    try {
      const docRef = doc(db, "users", id);
      await updateDoc(docRef, {
        avatar: newAvatarUri,
      });
    } catch (e) {
      console.error("Error happened while updating user's avatar in db: ", e);
    }
  }


  //puzzles collection

  //add a new puzzle to db
  export async function addPuzzleToDB(puzzle, userId) {
    try {

      const coverImageUri = await getRandomImageFromNASA();

      if (!coverImageUri) {
        throw new Error("Unable to get random image from NASA API.")
      }

      await addDoc(collection(db, "puzzles"),{
        puzzle: puzzle,
        userId: userId,
        coverImageUri: coverImageUri,
        win: 0,
        lose: 0,
      })
    } catch (e) {
      console.error("Error happened while adding puzzle to db: ", e);
    }
  }

  //read a single puzzle from db using userId
  export async function getPuzzleFromDB(userId) {
    try {
      const q = query(collection(db, "puzzles"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const doc = querySnapshot.docs[0];
      if (doc) {
        return { ...doc.data(), id: doc.id };
      } else {
        return null;
      }
    } catch (e) {
      console.error("Error happened while getting puzzle from db: ", e);
    }
  }

  //update a puzzle in db
  export async function updatePuzzleInDB(id, newPuzzle) {
    try {
      const docRef = doc(db, "puzzles", id);
      await updateDoc(docRef, {
        puzzle: newPuzzle,
      });
    } catch (e) {
      console.error("Error happened while updating puzzle in db: ", e);
    }
  }

  //delete a puzzle from db
  export async function deletePuzzleFromDB(id) {
    try {
      await deleteDoc(doc(db, "puzzles", id));
    } catch (e) {
      console.error("Error happened while deleting puzzle from db: ", e);
    }
  }

  //activities collection