import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import MachinesScreen from "../../screens/MachinesScreen";
import MaintenanceScreen from "../../screens/MaintenanceScreen";
import PartsScreen from "../../screens/PartsScreen";
import TeamsScreen from "../../screens/TeamsScreen";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

const AppNavigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string = "";

            if (route.name === "Máquinas") {
              iconName = focused ? "construct" : "construct-outline";
            } else if (route.name === "Manutenções") {
              iconName = focused ? "build" : "build-outline";
            } else if (route.name === "Peças") {
              iconName = focused ? "cube" : "cube-outline";
            } else if (route.name === "Equipes") {
              iconName = focused ? "people" : "people-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#1565C0",
          tabBarInactiveTintColor: "gray",
          headerShown: false,
        })}
      >
        <Tab.Screen name="Máquinas" component={MachinesScreen} />
        <Tab.Screen name="Manutenções" component={MaintenanceScreen} />
        <Tab.Screen name="Peças" component={PartsScreen} />
        <Tab.Screen name="Equipes" component={TeamsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
