import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native'; // Adiciona o import de Platform
import { IoExit } from 'react-icons/io5';
import { FaTachometerAlt, FaCogs, FaWrench, FaWarehouse, FaUsers } from 'react-icons/fa';

interface SidebarMenuProps {
  navigation: any; // Altere para o tipo específico se necessário
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ navigation }) => {
  
  const handleLinkPress = (screen: string, href: string) => {
    if (Platform.OS === 'web') {
      Linking.openURL(href);
    } else {
      navigation.navigate(screen);
    }
  };

  return (
    <View style={styles.sidebar}>
      <Text style={styles.sidebarTitle}>Vincenzo Amendola</Text>

      <View style={styles.menu}>
        <TouchableOpacity onPress={() => handleLinkPress('DashboardScreen', 'http://10.109.25.127:8081/screen/DashboardScreen')} style={styles.menuItem}>
          <FaTachometerAlt style={styles.icon} />
          <Text style={styles.menuItemText}>Dashboards</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLinkPress('MachinesScreen', 'http://10.109.25.127:8081/screens/MachineScreen')} style={styles.menuItem}>
          <FaCogs style={styles.icon} />
          <Text style={styles.menuItemText}>Máquinas</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLinkPress('MaintenanceScreen', 'http://10.109.25.127:8081/screens/Maintenance')} style={styles.menuItem}>
          <FaWrench style={styles.icon} />
          <Text style={styles.menuItemText}>Manutenções</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLinkPress('StockScreen', 'http://10.109.25.127:8081/screens/StockScreen')} style={styles.menuItem}>
          <FaWarehouse style={styles.icon} />
          <Text style={styles.menuItemText}>Estoque</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLinkPress('TeamsScreen', 'http://10.109.25.127:8081/screens/TeamScreen')} style={styles.menuItem}>
          <FaUsers style={styles.icon} />
          <Text style={styles.menuItemText}>Equipes</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.exitButton}>
        <IoExit style={styles.exitIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default SidebarMenu;
