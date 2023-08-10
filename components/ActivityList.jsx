import { View, Text, FlatList } from 'react-native'
import React from 'react'
import ActivityInList from './ActivityInList'

export default function ActivityList({ activities, editHandler, deleteHandler, joinHandler, leaveHandler }) {
  return (
    <FlatList
      data={activities}
      renderItem={({ item }) => (
        <ActivityInList activity={item} editHandler={editHandler} deleteHandler={deleteHandler} joinHandler={joinHandler} leaveHandler={leaveHandler}/>
      )}
    />
  )
}