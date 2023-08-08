import { View, Text } from 'react-native'
import React from 'react'
import PressableButton from '../components/PressableButton'

export default function Find({ navigation }) {
  return (
    <View>
      <PressableButton onPress={()=>{navigation.replace("Game")}}>
        <Text>Fight</Text>
      </PressableButton>
    </View>
  )
}