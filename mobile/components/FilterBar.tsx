import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface FilterBarProps {
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
  totalMachines: number;
}

const FilterBar: React.FC<FilterBarProps> = ({ selectedFilter, onSelectFilter, totalMachines }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.totalText}>Total de Máquinas: {totalMachines}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, selectedFilter === "Todos" && styles.selectedButton]}
          onPress={() => onSelectFilter("Todos")}
        >
          <Text style={[styles.buttonText, selectedFilter === "Todos" && styles.selectedButtonText]}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedFilter === "Em Manutenção" && styles.selectedButton]}
          onPress={() => onSelectFilter("Em Manutenção")}
        >
          <Text style={[styles.buttonText, selectedFilter === "Em Manutenção" && styles.selectedButtonText]}>
            Em Manutenção
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedFilter === "Operacional" && styles.selectedButton]}
          onPress={() => onSelectFilter("Operacional")}
        >
          <Text style={[styles.buttonText, selectedFilter === "Operacional" && styles.selectedButtonText]}>
            Operacional
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedFilter === "Quebrada" && styles.selectedButton]}
          onPress={() => onSelectFilter("Quebrada")}
        >
          <Text style={[styles.buttonText, selectedFilter === "Quebrada" && styles.selectedButtonText]}>
            Quebrada
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedFilter === "Desativada" && styles.selectedButton]}
          onPress={() => onSelectFilter("Desativada")}
        >
          <Text style={[styles.buttonText, selectedFilter === "Desativada" && styles.selectedButtonText]}>
            Desativada
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1565C0",
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#1565C0",
    borderRadius: 20,
  },
  selectedButton: {
    backgroundColor: "#1565C0",
  },
  buttonText: {
    fontSize: 14,
    color: "#1565C0",
  },
  selectedButtonText: {
    color: "#FFF",
  },
});

export default FilterBar;
