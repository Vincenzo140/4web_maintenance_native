import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

const TeamsHeader: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Equipes</Text>
    <Text style={styles.subtitle}>Times de manutenção e suas especialidades</Text>
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

export default TeamsHeader;