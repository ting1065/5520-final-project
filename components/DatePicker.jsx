import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import PressableButton from "./PressableButton";
import { MaterialIcons } from '@expo/vector-icons';

export default function DatePicker({ confirmDateHandler, initialDate, date }) {
  const [modalVisible, setModalVisible] = useState(false);

  const dateFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    timeZoneName: "short",
  };
  const formattedDate = date
    ? date.toLocaleString(undefined, dateFormatOptions)
    : "";

  return (
    <View style={styles.container}>
      <PressableButton
        defaultStyle={styles.editNameDefaultStyle}
        pressedStyle={styles.editNamePressedStyle} 
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.dateInnerContainer}>
          <MaterialIcons name="date-range" size={24} color="black" /> 
          <Text style={styles.inputDisplay}>{"<"}Set Starting Time{">"}</Text>
        </View>
        
      </PressableButton>
      <Text style={styles.inputDisplay}>{formattedDate}</Text>
      <DateTimePickerModal
        isVisible={modalVisible}
        mode="datetime"
        date={
          initialDate
            ? initialDate < new Date()
              ? new Date()
              : initialDate
            : new Date()
        }
        minimumDate={new Date()}
        onConfirm={(date) => {
          confirmDateHandler(date);
          setModalVisible(false);
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',

  },
  dateInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editNameDefaultStyle: {
    backgroundColor: 'white',
    width: 250,
    height: 40,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginVertical: 15,
  },
  editNamePressedStyle: {
    opacity: 0.5,
  },
  inputDisplay: {
    fontSize: 20,
  },

})