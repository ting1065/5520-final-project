import { View, Text, TextInput, Alert } from 'react-native'
import React,  { useState } from 'react'
import PressableButton from '../components/PressableButton'
import { auth } from "../Firebase/firebase-setup";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login({ navigation }) {

  //regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function loginHandler() {

    if (!emailRegex.test(email)) {
      Alert.alert("Please enter a valid email address");
      return;
    }

    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log("error happened while logging in:",error);
    }
  }


  return (
    <View>
      <Text>Email Address</Text>
      <TextInput autoCapitalize="none" placeholder="Email" value={email} onChangeText={(newText)=>setEmail(newText)}/>
      <Text>Password</Text>
      <TextInput autoCapitalize="none" placeholder="Password" secureTextEntry={true} value={password} onChangeText={(newText)=>setPassword(newText)}/>
      <PressableButton onPress={()=>loginHandler()}>
        <Text>Log In</Text>
      </PressableButton>
      <Text>New User?</Text>
      <PressableButton onPress={()=>{navigation.replace("Signup")}}>
        <Text>Create an account</Text>
      </PressableButton>
    </View>
  )
}