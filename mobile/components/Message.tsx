import React from "react";
import { Text, StyleSheet } from "react-native";

interface MessageProps {
  text: string;
}

const Message: React.FC<MessageProps> = ({ text }) => {
  return <Text style={styles.text}>{text}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default Message;
