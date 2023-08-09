import { View, Text, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import PressableButton from '../components/PressableButton'
import { auth } from "../Firebase/firebase-setup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addUserToDB } from '../Firebase/firebase-helper';

export default function Signup({ navigation }) {

  //regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  async function signupHandler() {

    if (!emailRegex.test(email)) {
      Alert.alert("Please enter a valid email address");
      return;
    }

    if (password !== confirmedPassword) {
      Alert.alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Password should be at least 6 characters");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await addUserToDB(auth.currentUser.uid, auth.currentUser.email);
    } catch (error) {
      console.log("error happened while signing up:",error);
    }
  }

  return (
    <View>
      <Text>Email Address</Text>
      <TextInput autoCapitalize="none" placeholder="Email" value={email} onChangeText={(newText)=>setEmail(newText)}/>
      <Text>Password</Text>
      <TextInput autoCapitalize="none" placeholder="Password" secureTextEntry={true} value={password} onChangeText={(newText)=>setPassword(newText)}/>
      <Text>Confirm Password</Text>
      <TextInput autoCapitalize="none" placeholder="Password" secureTextEntry={true} value={confirmedPassword} onChangeText={(newText)=>setConfirmedPassword(newText)}/>
      <PressableButton onPress={()=>signupHandler()}>
        <Text>Register</Text>
      </PressableButton>
      <Text>Already Registered?</Text>
      <PressableButton onPress={()=>navigation.replace("Login")}>
        <Text>Login</Text>
      </PressableButton>
    </View>
  )
}