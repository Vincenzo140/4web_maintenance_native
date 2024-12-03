import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

const MaintenanceHeader: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Manutenções</Text>
    <Text style={styles.subtitle}>Lista de manutenções em andamento e concluídas</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.paper,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body2,
    color: colors.text.secondary,
  },
});

export default MaintenanceHeader;