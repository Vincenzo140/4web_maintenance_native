import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useMaintenances } from "../hooks/useMaintenances";
import MaintenanceHeader from "../components/MaintenanceHeader";
import MaintenanceCard from "../components/MaintenanceCard";
import ErrorMessage from "../components/ErrorMessage";
import LoadingIndicator from "../components/LoadingIndicator";
import { colors } from "../theme";

const MaintenanceScreen: React.FC = () => {
  const { maintenances, loading, error } = useMaintenances();

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;

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
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.background.default,
  },
});

export default MaintenanceScreen;