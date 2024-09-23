import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView } from 'react-native';
import { IoExit } from 'react-icons/io5';
import { FaTachometerAlt, FaCogs, FaWrench, FaWarehouse, FaUsers } from 'react-icons/fa';

interface Tool {
  name: string;
  code: string;
  quantity: number;
  date: string;
}

const StockScreen = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [newTool, setNewTool] = useState<Omit<Tool, 'quantity'>>({ name: '', code: '', date: '' });
  const [quantity, setQuantity] = useState<number>(0);

  const handleAddTool = () => {
    if (newTool.name && newTool.code && quantity > 0 && newTool.date) {
      setTools([...tools, { ...newTool, quantity }]);
      setNewTool({ name: '', code: '', date: '' });
      setQuantity(0);
    }
  };

  return (
    <View style={styles.container}>
      {/* Menu Lateral */}
      <View style={styles.sidebar}>
        <Text style={styles.sidebarTitle}>Vincenzo Amendola</Text>
        <View style={styles.menu}>
          <View style={styles.menuItem}>
            <FaTachometerAlt style={styles.icon} />
            <Text style={styles.menuItemText}>Dashboards</Text>
          </View>
          <View style={styles.menuItem}>
            <FaCogs style={styles.icon} />
            <Text style={styles.menuItemText}>Máquinas</Text>
          </View>
          <View style={styles.menuItem}>
            <FaWrench style={styles.icon} />
            <Text style={styles.menuItemText}>Manutenções</Text>
          </View>
          <View style={styles.menuItem}>
            <FaWarehouse style={styles.icon} />
            <Text style={styles.menuItemText}>Estoque</Text>
          </View>
          <View style={styles.menuItem}>
            <FaUsers style={styles.icon} />
            <Text style={styles.menuItemText}>Equipes</Text>
          </View>
        </View>
        <View style={styles.exitButton}>
          <IoExit style={styles.exitIcon} />
        </View>
      </View>

      {/* Conteúdo Principal */}
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Controle de Estoque</Text>

        {/* Formulário para Adicionar Ferramentas */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Adicionar Ferramenta</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome da Ferramenta"
            value={newTool.name}
            onChangeText={(text) => setNewTool({ ...newTool, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Código"
            value={newTool.code}
            onChangeText={(text) => setNewTool({ ...newTool, code: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantidade"
            keyboardType="numeric"
            value={quantity > 0 ? quantity.toString() : ''}
            onChangeText={(text) => setQuantity(parseInt(text) || 0)}
          />
          <TextInput
            style={styles.input}
            placeholder="Data de Adição"
            value={newTool.date}
            onChangeText={(text) => setNewTool({ ...newTool, date: text })}
          />
          <Button title="Adicionar" onPress={handleAddTool} />
        </View>

        {/* Tabela de Ferramentas no Estoque */}
        <FlatList
          data={tools}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.cell}>{item.name}</Text>
              <Text style={styles.cell}>{item.code}</Text>
              <Text style={styles.cell}>{item.quantity}</Text>
              <Text style={styles.cell}>{item.date}</Text>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 200,
    backgroundColor: '#1c1c1c',
    padding: 20,
    alignItems: 'center',
  },
  sidebarTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  menu: {
    flex: 1,
    width: '100%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 10,
    backgroundColor: '#333',
    marginBottom: 10,
    borderRadius: 5,
  },
  menuItemText: {
    color: '#fff',
    marginLeft: 10,
  },
  icon: {
    color: '#fff',
    fontSize: 20,
  },
  exitButton: {
    marginTop: 'auto',
    marginBottom: 10,
  },
  exitIcon: {
    color: '#fff',
    fontSize: 40,
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: '#6a1b9a',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default StockScreen;
