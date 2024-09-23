// app/index.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Bem-vindo ao Sistema de Gerenciamento</Text>
      <Link href="/screens/LoginScreen">
        <Button title="Entrar" />
      </Link>
    </View>
  );
}
