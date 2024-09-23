import React from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import SidebarMenu from '../../components/SidebarMenu'; // Importando o SidebarMenu
import { useNavigation } from '@react-navigation/native'; // Importando o hook de navegação

const screenWidth = Dimensions.get('window').width;

const mockData = {
  machines: {
    operational: 50,
    underMaintenance: 15,
    total: 65,
  },
  maintenance: {
    completed: 120,
    pending: 30,
    total: 150,
  },
  teams: {
    active: 10,
    inactive: 2,
    total: 12,
  },
};

const machineData = {
  labels: ['Operacional', 'Em Manutenção'],
  datasets: [
    {
      data: [mockData.machines.operational, mockData.machines.underMaintenance],
    },
  ],
};

const maintenanceData = {
  labels: ['Concluídas', 'Pendentes'],
  datasets: [
    {
      data: [mockData.maintenance.completed, mockData.maintenance.pending],
    },
  ],
};

const teamsData = {
  labels: ['Ativas', 'Inativas'],
  datasets: [
    {
      data: [mockData.teams.active, mockData.teams.inactive],
    },
  ],
};

export default function DashboardScreen() {
  const navigation = useNavigation(); // Hook para navegação

  return (
    <View style={styles.container}>
      {/* Menu Lateral */}
      <SidebarMenu navigation={navigation} />

      {/* Conteúdo Principal */}
      <ScrollView style={styles.content}>
        <Text style={styles.header}>Dashboard</Text>

        {/* Gráfico de Máquinas */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Máquinas</Text>
          <BarChart
            data={machineData}
            width={screenWidth - 80}
            height={220}
            fromZero
            chartConfig={chartConfig('#4CAF50')}
            yAxisLabel=""
            yAxisSuffix=""
          />
          <Text style={styles.cardFooter}>Total de Máquinas: {mockData.machines.total}</Text>
        </View>

        {/* Gráfico de Manutenções */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Manutenções</Text>
          <BarChart
            data={maintenanceData}
            width={screenWidth - 80}
            height={220}
            fromZero
            chartConfig={chartConfig('#2196F3')}
            yAxisLabel=""
            yAxisSuffix=""
          />
          <Text style={styles.cardFooter}>Total de Manutenções: {mockData.maintenance.total}</Text>
        </View>

        {/* Gráfico de Equipes */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Equipes</Text>
          <BarChart
            data={teamsData}
            width={screenWidth - 80}
            height={220}
            fromZero
            chartConfig={chartConfig('#673AB7')}
            yAxisLabel=""
            yAxisSuffix=""
          />
          <Text style={styles.cardFooter}>Total de Equipes: {mockData.teams.total}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const chartConfig = (color: string) => ({
  backgroundColor: '#fff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `${color}`,
  barPercentage: 0.7,
  decimalPlaces: 0,
  style: {
    borderRadius: 16,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: '#4c51bf',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  cardFooter: {
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
    color: '#333',
  },
});
