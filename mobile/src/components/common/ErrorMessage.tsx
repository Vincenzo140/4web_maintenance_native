import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <View style={styles.container}>
    <Ionicons name="alert-circle" size={48} color={colors.status.broken} />
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.default,
    padding: spacing.xl,
  },
  message: {
    ...typography.body1,
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

export default ErrorMessage;