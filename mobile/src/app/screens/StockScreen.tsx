import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Certifique-se de instalar o expo vector icons

const StockScreen = () => {
  const [tools, setTools] = useState<{ name: string; code: string; quantity: number; date: string }[]>([]);
  const [newTool, setNewTool] = useState({ name: '', code: '', quantity: 0, date: '' });

  const handleAddTool = () => {
    setTools([...tools, newTool]);
    setNewTool({ name: '', code: '', quantity: 0, date: '' });
  };

  return (
    <View style={styles.container}>
      {/* Menu Lateral */}
      <View style={styles.sidebar}>
        <Text style={styles.username}>Vincenzo Amendola</Text>
        {/* Adicione seus itens de menu aqui */}
        <View style={styles.menuItem}>
          <Ionicons name="home-outline" size={24} color="white" />
          <Text style={styles.menuText}>Dashboards</Text>
        </View>
        <View style={styles.menuItem}>
          <Ionicons name="settings-outline" size={24} color="white" />
          <Text style={styles.menuText}>Máquinas</Text>
        </View>
        <View style={styles.menuItem}>
          <Ionicons name="build-outline" size={24} color="white" />
          <Text style={styles.menuText}>Manutenções</Text>
        </View>
        <View style={styles.menuItem}>
          <Ionicons name="cube-outline" size={24} color="white" />
          <Text style={styles.menuText}>Estoque</Text>
        </View>
        <View style={styles.menuItem}>
          <Ionicons name="people-outline" size={24} color="white" />
          <Text style={styles.menuText}>Equipes</Text>
        </View>
        <Ionicons name="log-out-outline" size={40} color="white" style={styles.logoutIcon} />
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
            value={newTool.quantity.toString()}
            onChangeText={(text) => setNewTool({ ...newTool, quantity: parseInt(text) })}
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
    width: 250,
    backgroundColor: '#1F2937',
    padding: 16,
    alignItems: 'center',
  },
  username: {
    color: 'white',
    fontSize: 18,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  menuText: {
    color: 'white',
    marginLeft: 8,
  },
  logoutIcon: {
    marginTop: 'auto',
    marginBottom: 16,
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  form: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default StockScreen;
