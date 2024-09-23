import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import SidebarMenu from '../../components/SidebarMenu'; // Importando o SidebarMenu

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
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {/* Menu Lateral */}
      <SidebarMenu />

      {/* Conteúdo Principal */}
      <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#4c51bf' }}>
        <Text style={{ fontSize: 24, color: 'white', textAlign: 'center', marginBottom: 20 }}>Dashboard</Text>

        {/* Gráfico de Máquinas */}
        <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>Máquinas</Text>
          <BarChart
            data={machineData}
            width={300}
            height={220}
            fromZero
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
            }}
            yAxisLabel="" // Adicionando rótulo do eixo Y
            yAxisSuffix="" // Adicionando sufixo do eixo Y
          />
          <Text style={{ textAlign: 'center', marginTop: 10 }}>Total de Máquinas: {mockData.machines.total}</Text>
        </View>

        {/* Gráfico de Manutenções */}
        <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>Manutenções</Text>
          <BarChart
            data={maintenanceData}
            width={300}
            height={220}
            fromZero
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
            }}
            yAxisLabel="" // Adicionando rótulo do eixo Y
            yAxisSuffix="" // Adicionando sufixo do eixo Y
          />
          <Text style={{ textAlign: 'center', marginTop: 10 }}>Total de Manutenções: {mockData.maintenance.total}</Text>
        </View>

        {/* Gráfico de Equipes */}
        <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>Equipes</Text>
          <BarChart
            data={teamsData}
            width={300}
            height={220}
            fromZero
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(103, 58, 183, ${opacity})`,
            }}
            yAxisLabel="" // Adicionando rótulo do eixo Y
            yAxisSuffix="" // Adicionando sufixo do eixo Y
          />
          <Text style={{ textAlign: 'center', marginTop: 10 }}>Total de Equipes: {mockData.teams.total}</Text>
        </View>
      </ScrollView>
    </View>
  );
}
