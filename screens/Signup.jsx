import { View, Text, TextInput, Alert, StyleSheet } from "react-native";
import React, { useState } from "react";
import PressableButton from "../components/PressableButton";
import { auth } from "../Firebase/firebase-setup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addUserToDB } from "../Firebase/firebase-helper";
import Card from "../components/Card";
import { colors } from '../Colors';
import {LinearGradient}  from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

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
      console.log("error happened while signing up:", error);
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.gradient1, colors.gradient2, colors.gradient3]}
        style={StyleSheet.absoluteFill}
      />
      <Text style={styles.appName}>Memory Master</Text>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeBigWrods}>Welcome!</Text>
        <Text style={styles.welcomesmallWrods}>Signup into your account</Text>
      </View>
      
      <Text>Email Address</Text>
      <TextInput
        autoCapitalize="none"
        placeholder="Email"
        value={email}
        onChangeText={(newText) => setEmail(newText)}
      />
      <Text>Password</Text>
      <TextInput
        autoCapitalize="none"
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(newText) => setPassword(newText)}
      />
      <Text>Confirm Password</Text>
      <TextInput
        autoCapitalize="none"
        placeholder="Password"
        secureTextEntry={true}
        value={confirmedPassword}
        onChangeText={(newText) => setConfirmedPassword(newText)}
      />
      <Text>=======</Text>
      <PressableButton onPress={() => signupHandler()}>
        <Text>Register</Text>
      </PressableButton>
      <Text>=======</Text>
      <Text>Already Registered?</Text>
      <Text>=======</Text>
      <PressableButton onPress={() => navigation.replace("Login")}>
        <Text>Login</Text>
      </PressableButton>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  welcomeContainer : {
    width: 300,
    alignSelf: 'center',
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
    fontFamily: 'Cochin',
    fontWeight: 'bold'
  },
  // inputTitle: {
  //   fontSize: 20,
  //   marginVertical: 20,
  // },
  // textInput: {
  //   fontSize: 20,
  //   height: 40,
  //   width: '90%',
  //   paddingLeft: 5,
  // },
  // user: {
  //   marginTop: 10,
  //   alignSelf: 'center',
  // },
  // inputContainer: {
  //   flexDirection: 'row',
  //   backgroundColor: colors.inputBackground,
  //   borderRadius: 5,
  // }, 
  // iconContainer: {
  //   marginHorizontal: 5,
  //   marginTop: 8,
  // },
  // loginButtonText: {
  //   color: colors.whiteWords,
  //   fontSize: 20,
  //   alignSelf: 'center',

  // },
  // defaultStyle: {
  //   width: 200,
  //   height: 45,
  //   marginTop: 30,
  //   alignSelf: 'center',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   borderRadius: 5,
  //   backgroundColor: colors.loginButton,
  //   // Add platform-specific shadow
  //   ...Platform.select({
  //     ios: {
  //       shadowColor: colors.shadowColor,
  //       shadowOffset: { width: 0, height: 3 },
  //       shadowOpacity: 0.27,
  //       shadowRadius: 4.65,
        
  //     },
  //     android: {
  //       elevation: 6,
  //     },
  //   }),
  // },
  // pressedStyle: {
  //   backgroundColor: colors.pressedLoginButton,
  //   opacity: 0.5,
  // },
  // bottomContainer: {
  //   marginTop: 30,
  //   flexDirection: 'row',
  // },
  // // defaultStyleBottom: {

  // // },
  // pressedStyleBottom: {
  //   opacity: 0.2,
  // },
  // createAccountText: {
  //   color: colors.redWords,
  // }
  
});
