import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="screens/DashboardScreen" />
      <Stack.Screen name="screens/MachineScreen" />
      <Stack.Screen name="screens/Maintenance" />
      <Stack.Screen name="screens/TeamScreen" />
      <Stack.Screen name="screens/StockScreen" />
      <Stack.Screen name="screens/LoginScreen" />
    </Stack>
  );
}
