import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { IoExit } from 'react-icons/io5';
import { FaTachometerAlt, FaCogs, FaWrench, FaWarehouse, FaUsers } from 'react-icons/fa';

const TeamsScreen = () => {
  const [teams, setTeams] = useState<{ name: string; leader: string; members: number; status: string }[]>([]);
  const [newTeam, setNewTeam] = useState({ name: '', leader: '', members: 0, status: 'Ativa' });

  const handleAddTeam = () => {
    if (newTeam.name && newTeam.leader) {
      setTeams([...teams, newTeam]);
      setNewTeam({ name: '', leader: '', members: 0, status: 'Ativa' });
    }
  };

  const handleRemoveTeam = (index: number) => {
    setTeams(teams.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      {/* Menu Lateral */}
      <View style={styles.sidebar}>
        <Text style={styles.sidebarTitle}>Vincenzo Amendola</Text>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem}>
            <FaTachometerAlt style={styles.icon} />
            <Text style={styles.menuItemText}>Dashboards</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <FaCogs style={styles.icon} />
            <Text style={styles.menuItemText}>Máquinas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <FaWrench style={styles.icon} />
            <Text style={styles.menuItemText}>Manutenções</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <FaWarehouse style={styles.icon} />
            <Text style={styles.menuItemText}>Estoque</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <FaUsers style={styles.icon} />
            <Text style={styles.menuItemText}>Equipes</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.exitButton}>
          <IoExit style={styles.exitIcon} />
        </TouchableOpacity>
      </View>

      {/* Conteúdo Principal */}
      <View style={styles.content}>
        <Text style={styles.title}>Equipes</Text>

        {/* Formulário para Adicionar Equipe */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Adicionar Equipe</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome da Equipe"
            value={newTeam.name}
            onChangeText={(text) => setNewTeam({ ...newTeam, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Líder"
            value={newTeam.leader}
            onChangeText={(text) => setNewTeam({ ...newTeam, leader: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Integrantes"
            keyboardType="numeric"
            value={newTeam.members.toString()}
            onChangeText={(text) => setNewTeam({ ...newTeam, members: parseInt(text, 10) })}
          />
          <TextInput
            style={styles.input}
            placeholder="Status"
            value={newTeam.status}
            onChangeText={(text) => setNewTeam({ ...newTeam, status: text })}
          />

          <Button title="Adicionar Equipe" onPress={handleAddTeam} />
        </View>

        {/* Tabela de Equipes */}
        <ScrollView>
          {teams.map((team, index) => (
            <View key={index} style={styles.teamRow}>
              <Text style={styles.teamText}>{team.name}</Text>
              <Text style={styles.teamText}>{team.leader}</Text>
              <Text style={styles.teamText}>{team.members}</Text>
              <Text style={styles.teamText}>{team.status}</Text>
              <Button title="Remover" color="red" onPress={() => handleRemoveTeam(index)} />
            </View>
          ))}
        </ScrollView>
      </View>
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
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 5,
  },
  teamText: {
    color: '#333',
    flex: 1,
  },
});

export default TeamsScreen;
