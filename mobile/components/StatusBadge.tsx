import React from "react";
import { Text, StyleSheet } from "react-native";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isMaintenance = status === "maintenance";
  return (
    <Text style={[styles.badge, isMaintenance ? styles.maintenance : styles.operational]}>
      {isMaintenance ? "Em Manutenção" : "Operacional"}
    </Text>
  );
};

const styles = StyleSheet.create({
  badge: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 6,
    borderRadius: 8,
    color: "#fff",
    overflow: "hidden",
  },
  maintenance: {
    backgroundColor: "#D32F2F",
  },
  operational: {
    backgroundColor: "#388E3C",
  },
});

export default StatusBadge;
