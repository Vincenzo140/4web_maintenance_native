import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { getMaintenances } from "../services/api";
import MaintenanceHeader from "../src/components/MaintenanceHeader";
import MaintenanceCard from "../src/components/MaintenanceCard";
import ErrorMessage from "../src/components/common/ErrorMessage";

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
        const data = await getMaintenances();
        setMaintenances(data);
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
    return <ErrorMessage message={error} />;
  }

  return (
    <FlatList
      data={maintenances}
      keyExtractor={(item) => item.maintenance_register_id}
      renderItem={({ item }) => (
        <MaintenanceCard
          problemDescription={item.problem_description}
          requestDate={item.request_date}
          priority={item.priority}
          assignedTeam={item.assigned_team_id}
          status={item.status}
          machineId={item.machine_id}
        />
      )}
      contentContainerStyle={styles.list}
      ListHeaderComponent={<MaintenanceHeader />}
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#F5F5F5",
  },
});

export default MaintenanceScreen;
