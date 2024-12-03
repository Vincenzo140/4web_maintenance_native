import React from "react";
import { View, Text, StyleSheet } from "react-native";
import StatusBadge from "./StatusBadge";

interface MachineCardProps {
  name: string;
  model: string;
  type: string;
  serial_number: string;
  location: string;
  status: string;
}

const translateStatus = (status: string): string => {
  switch (status) {
    case "operational":
      return "Operacional";
    case "maintenance":
      return "Em Manutenção";
    case "broken":
      return "Quebrada";
    case "retired":
      return "Desativada";
    default:
      return "Desconhecido";
  }
};

const MachineCard: React.FC<MachineCardProps> = ({ name, model, type, serial_number, location, status }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.subtitle}>Modelo: {model}</Text>
      <Text style={styles.detail}>Tipo: {type}</Text>
      <Text style={styles.detail}>Número de Série: {serial_number}</Text>
      <Text style={styles.detail}>Localização: {location}</Text>
      <Text style={styles.status}>Status: {translateStatus(status)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#E3F2FD",
    padding: 20,
    marginVertical: 10,
    borderRadius: 12,
    borderColor: "#BBDEFB",
    borderWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1565C0",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E88E5",
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 5,
  },
  status: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "#2E7D32",
  },
});

export default MachineCard;
