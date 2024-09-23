// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/DashboardScreen" options={{ title: 'Dashboard' }} />
      <Stack.Screen name="screens/LoginScreen" options={{ title: 'Login' }} />
      <Stack.Screen name="screens/MachineScreen" options={{ title: 'Máquinas' }} />
      <Stack.Screen name="screens/Maintenance" options={{ title: 'Manutenção' }} />
      <Stack.Screen name="screens/StockScreen" options={{ title: 'Estoque' }} />
      <Stack.Screen name="screens/TeamScreen" options={{ title: 'Equipes' }} />
    </Stack>
  );
}
