import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";

interface Maintenance {
  maintenance_register_id: string;
  problem_description: string;
  request_date: string;
  priority: string;
  assigned_team_id: string;
  status: string;
  machine_id: string;
}

const MaintenanceScreen: React.FC = () => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaintenances = async () => {
      try {
        const response = await axios.get("http://localhost:8000/maintenance");
        setMaintenances(response.data);
        setError(null);
      } catch (err) {
        setError("Erro ao carregar manutenções.");
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenances();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1565C0" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={maintenances}
      keyExtractor={(item) => item.maintenance_register_id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.problem_description}</Text>
          <Text>Data: {item.request_date}</Text>
          <Text>Prioridade: {item.priority}</Text>
          <Text>Equipe: {item.assigned_team_id}</Text>
          <Text>Status: {item.status}</Text>
        </View>
      )}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "#E3F2FD",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1565C0",
  },
});

export default MaintenanceScreen;
