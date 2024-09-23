import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import SidebarMenu from '../../components/SidebarMenu';

interface Machine {
  name: string;
  model: string;
  status: string;
  location: string;
  responsible: string;
}

interface MachineScreenProps {
  navigation: any; // Substitua por um tipo mais específico, se necessário
}

export default function MachineScreen({ navigation }: MachineScreenProps) {
  const [machines, setMachines] = useState<Machine[]>([
    { name: 'Máquina A', model: 'Modelo X', status: 'Operacional', location: 'Setor A', responsible: 'João Silva' },
    { name: 'Máquina B', model: 'Modelo Y', status: 'Manutenção', location: 'Setor B', responsible: 'Maria Souza' }
  ]);

  const [formData, setFormData] = useState<Machine>({
    name: '',
    model: '',
    status: '',
    location: '',
    responsible: ''
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleAddMachine = () => {
    if (formData.name && formData.model) {
      setMachines([...machines, formData]);
      setFormData({ name: '', model: '', status: '', location: '', responsible: '' });
    }
  };

  const renderItem = ({ item }: { item: Machine }) => (
    <View style={styles.machineRow}>
      <Text style={styles.machineText}>{item.name}</Text>
      <Text style={styles.machineText}>{item.model}</Text>
      <Text style={styles.machineText}>{item.status}</Text>
      <Text style={styles.machineText}>{item.location}</Text>
      <Text style={styles.machineText}>{item.responsible}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <SidebarMenu navigation={navigation} />
      <View style={styles.mainContent}>
        <Text style={styles.title}>Máquinas</Text>
        <FlatList
          data={machines}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.table}
        />
        <View style={styles.form}>
          <Text style={styles.formTitle}>Adicionar Máquina</Text>
          <TextInput
            placeholder="Máquina"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            style={styles.input}
          />
          <TextInput
            placeholder="Modelo"
            value={formData.model}
            onChangeText={(value) => handleInputChange('model', value)}
            style={styles.input}
          />
          <TextInput
            placeholder="Status"
            value={formData.status}
            onChangeText={(value) => handleInputChange('status', value)}
            style={styles.input}
          />
          <TextInput
            placeholder="Localização"
            value={formData.location}
            onChangeText={(value) => handleInputChange('location', value)}
            style={styles.input}
          />
          <TextInput
            placeholder="Responsável"
            value={formData.responsible}
            onChangeText={(value) => handleInputChange('responsible', value)}
            style={styles.input}
          />
          <Button title="Adicionar" onPress={handleAddMachine} />
        </View>
      </View>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#4ade80',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  table: {
    marginBottom: 20,
  },
  machineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  machineText: {
    fontSize: 14,
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
  },
  formTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
