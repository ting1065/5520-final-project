import { View, Text } from 'react-native'
import React from 'react'

export default function Game({ navigation, route }) {

  const clickedPlayer = route.params.clickedPlayer

  return (
    <View>
      <Text>challenging {clickedPlayer.name}'s puzzle</Text>
      <Text>quiz1: {clickedPlayer.puzzle[0]}</Text>
      <Text>quiz2: {clickedPlayer.puzzle[1]}</Text>
      <Text>quiz3: {clickedPlayer.puzzle[2]}</Text>
      <Text>quiz4: {clickedPlayer.puzzle[3]}</Text>
      <Text>quiz5: {clickedPlayer.puzzle[4]}</Text>
      <Text>=========</Text>
      <Text>still building this feature.</Text>
      <Text>coming soon!</Text>
    </View>
  )
}