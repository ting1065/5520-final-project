import { View, Text } from "react-native";
import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import PressableButton from "./PressableButton";

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
    <View>
      <PressableButton onPress={() => setModalVisible(true)}>
        <Text>
          {"<"}Set Starting Time{">"}
        </Text>
      </PressableButton>
      <Text>{formattedDate}</Text>
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
