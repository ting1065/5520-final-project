import { View, Text, TextInput, Alert, StyleSheet } from "react-native";
import React, { useState } from "react";
import PressableButton from "../components/PressableButton";
import { auth } from "../Firebase/firebase-setup";
import { signInWithEmailAndPassword } from "firebase/auth";
import Card from "../components/Card";
import { colors } from '../Colors';
import {LinearGradient}  from 'expo-linear-gradient';

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

    if (!password) {
      Alert.alert("Please enter a password");
      return;
    }

    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert("failed to log in, please check your email and password");
      console.log("error happened while logging in:", error);
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
        <Text style={styles.welcomeBigWrods}>Welcome</Text>
        <Text style={styles.welcomeBigWrods}>Back!</Text>
        <Text style={styles.welcomesmallWrods}>Login back into your account</Text>
      </View>
      
      <Card 
        width={300}
        height={300}
        backgroundColor={'white'}
      >
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
        <Text>=======</Text>
        <PressableButton onPress={() => loginHandler()}>
          <Text>Log In</Text>
        </PressableButton>
      </Card>
        
      <Text>=======</Text>
      <Text>New User?</Text>
      <Text>=======</Text>
      <PressableButton
        onPress={() => {
          navigation.replace("Signup");
        }}
      >
        <Text>Create an account</Text>
      </PressableButton>
      <Text>=======</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeContainer : {
    alignSelf: 'flex-start',
    marginLeft: 40,
    marginVertical: 40,
  },
  welcomeBigWrods: {
    // fontWeight: 'bold',
    fontSize: '30',
    color: 'white',
  },
  welcomesmallWrods: {
    color: 'white',
  },
  appName: {
    fontSize: '45',
    color: 'darkblue',
  }
});
