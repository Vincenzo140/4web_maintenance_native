import React from "react";
import { SafeAreaView, FlatList, StyleSheet } from "react-native";
import { Machine } from "../types";
import MachineCard from "../components/MachineCard";
import Header from "../components/Header";
import FilterBar from "../components/FilterBar";
import ErrorMessage from "../components/ErrorMessage";
import LoadingIndicator from "../components/LoadingIndicator";
import { translateStatus } from "../utils/statusHelpers";
import { colors } from "../theme";
import { useMachines } from "../hooks/useMachines";

const MachinesScreen: React.FC = () => {
  const {
    filteredMachines,
    selectedFilter,
    loading,
    error,
    handleFilterChange,
    machines
  } = useMachines();

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Máquinas" />
      <FilterBar
        selectedFilter={selectedFilter}
        onSelectFilter={handleFilterChange}
        totalMachines={machines.length}
      />
      <FlatList
        data={filteredMachines}
        keyExtractor={(item: Machine) => item.serial_number}
        renderItem={({ item }) => (
          <MachineCard
            name={item.name}
            model={item.model}
            type={item.type}
            serial_number={item.serial_number}
            location={item.location}
            status={translateStatus(item.status)}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});

export default MachinesScreen;