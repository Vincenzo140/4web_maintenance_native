import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

// Definindo os tipos de navegação
type RootStackParamList = {
  Dashboard: undefined;
  Machines: undefined;
  Maintenance: undefined;
  Teams: undefined;
  Stock: undefined;
  Login: undefined;
};

export default function SidebarMenu() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={{ width: 80, backgroundColor: '#1a202c', paddingVertical: 20 }}>
      <Text style={{ color: '#fff', textAlign: 'center', marginBottom: 20 }}>Vincenzo</Text>

      {/* Itens do Menu */}
      {menuItems.map(item => (
        <TouchableOpacity 
          key={item.name} 
          onPress={() => navigation.navigate(item.route as keyof RootStackParamList)}
        >
          <View style={{ marginBottom: 20, alignItems: 'center' }}>
            <FontAwesome name={item.icon as any} size={24} color="white" />
            <Text style={{ color: 'white', fontSize: 12 }}>{item.label}</Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Logout */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Ionicons name="exit-outline" size={24} color="white" style={{ marginTop: 'auto', textAlign: 'center' }} />
      </TouchableOpacity>
    </View>
  );
}

// Definindo os itens do menu em um array
const menuItems = [
  { name: 'Dashboard', route: 'Dashboard', icon: 'tachometer', label: 'Dashboard' },
  { name: 'Machines', route: 'Machines', icon: 'cogs', label: 'Machines' },
  { name: 'Maintenance', route: 'Maintenance', icon: 'wrench', label: 'Maintenance' },
  { name: 'Teams', route: 'Teams', icon: 'users', label: 'Teams' },
  { name: 'Stock', route: 'Stock', icon: 'archive', label: 'Stock' },
];
