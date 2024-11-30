import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Message from "./components/Message";
import CustomButton from "./components/CustomButton";

const App: React.FC = () => {
  const [message, setMessage] = useState("Olá, Mundo!");

  const handlePress = () => {
    setMessage("Você clicou no botão!");
  };

  return (
    <View style={styles.container}>
      <Message text={message} />
      <CustomButton title="Clique aqui" onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});

export default App;
