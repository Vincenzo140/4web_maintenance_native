import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import SidebarMenu from '../../components/SidebarMenu'; // Ajuste o caminho conforme necessário

const MaintenanceScreen = () => {
  // Estado para os dados da tabela
  const [maintenances, setMaintenances] = useState([
    { id: '1', machine: 'Máquina A', date: '2023-08-01', status: 'Concluída', technician: 'Carlos' },
    { id: '2', machine: 'Máquina B', date: '2023-08-15', status: 'Pendente', technician: 'Ana' }
  ]);

  // Estado para os dados do formulário
  const [formData, setFormData] = useState({
    machine: '',
    date: '',
    status: '',
    technician: ''
  });

  // Função para atualizar os dados do formulário
  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Função para adicionar uma nova manutenção
  const handleAddMaintenance = () => {
    setMaintenances([...maintenances, { id: Date.now().toString(), ...formData }]);
    setFormData({ machine: '', date: '', status: '', technician: '' });
  };

  return (
    <View style={styles.container}>
      <SidebarMenu /> {/* Inclui o SidebarMenu */}

      <View style={styles.content}>
        <Text style={styles.title}>Manutenções</Text>

        {/* Tabela de Manutenções */}
        <FlatList
          data={maintenances}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.cell}>{item.machine}</Text>
              <Text style={styles.cell}>{item.date}</Text>
              <Text style={styles.cell}>{item.status}</Text>
              <Text style={styles.cell}>{item.technician}</Text>
            </View>
          )}
        />

        {/* Formulário para Adicionar Manutenção */}
        <View style={styles.form}>
          <Text style={styles.label}>Máquina:</Text>
          <TextInput
            style={styles.input}
            value={formData.machine}
            onChangeText={(text) => handleInputChange('machine', text)}
          />
          <Text style={styles.label}>Data:</Text>
          <TextInput
            style={styles.input}
            value={formData.date}
            onChangeText={(text) => handleInputChange('date', text)}
          />
          <Text style={styles.label}>Status:</Text>
          <TextInput
            style={styles.input}
            value={formData.status}
            onChangeText={(text) => handleInputChange('status', text)}
          />
          <Text style={styles.label}>Técnico:</Text>
          <TextInput
            style={styles.input}
            value={formData.technician}
            onChangeText={(text) => handleInputChange('technician', text)}
          />
          <Button title="Adicionar Manutenção" onPress={handleAddMaintenance} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  form: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    marginBottom: 4,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
});

export default MaintenanceScreen;
