import React, { useEffect, useState } from "react";
import { SafeAreaView, FlatList, StyleSheet } from "react-native";
import { getMachines } from "../services/api";
import MachineCard from "../src/components/MachineCard";
import Header from "../src/components/Header";
import FilterBar from "../src/components/FilterBar";
import ErrorMessage from "../src/components/common/ErrorMessage";
import LoadingIndicator from "../src/components/common/LoadingIndicator";

interface Machine {
  name: string;
  type: string;
  model: string;
  serial_number: string;
  location: string;
  maintenance_history: string[];
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

const MachinesScreen: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [filteredMachines, setFilteredMachines] = useState<Machine[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("Todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMachines = async () => {
    try {
      const data = await getMachines();
      console.log("Dados das máquinas:", data);
      if (Array.isArray(data)) {
        setMachines(data as Machine[]);
        setError(null);
      } else {
        throw new Error("Formato inválido de dados.");
      }
    } catch (err) {
      console.error("Erro ao buscar máquinas:", err);
      setError("Não foi possível carregar os dados das máquinas.");
    } finally {
      setLoading(false);
    }
  };

  const filterMachines = (filter: string) => {
    setSelectedFilter(filter);

    if (filter === "Todos") {
      setFilteredMachines(machines);
    } else if (filter === "Em Manutenção") {
      setFilteredMachines(machines.filter((machine) => machine.status === "maintenance"));
    } else if (filter === "Operacional") {
      setFilteredMachines(machines.filter((machine) => machine.status === "operational"));
    } else if (filter === "Quebrada") {
      setFilteredMachines(machines.filter((machine) => machine.status === "broken"));
    } else if (filter === "Desativada") {
      setFilteredMachines(machines.filter((machine) => machine.status === "retired"));
    }
  };

  useEffect(() => {
    fetchMachines();
    const interval = setInterval(fetchMachines, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterMachines(selectedFilter);
  }, [machines]);

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Máquinas" />
      <FilterBar
        selectedFilter={selectedFilter}
        onSelectFilter={filterMachines}
        totalMachines={machines.length}
      />
      <FlatList
        data={filteredMachines}
        keyExtractor={(item) => item.serial_number}
        renderItem={({ item }) => (
          <MachineCard
            name={item.name}
            model={item.model}
            type={item.type}
            serial_number={item.serial_number}
            location={item.location}
            status={translateStatus(item.status)} // Exibe o status traduzido
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
    backgroundColor: "#F5F5F5",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});

export default MachinesScreen;
