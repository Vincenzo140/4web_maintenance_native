import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface StatusBadgeProps {
  status: string;
  style?: object;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'operacional':
      return colors.status.operational;
    case 'em manutenção':
      return colors.status.maintenance;
    case 'quebrada':
      return colors.status.broken;
    case 'desativada':
      return colors.status.retired;
    default:
      return colors.text.disabled;
  }
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, style }) => (
  <View style={[styles.badge, { backgroundColor: getStatusColor(status) }, style]}>
    <Text style={styles.text}>{status}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.caption,
    color: colors.background.paper,
    fontWeight: '600',
  },
});

export default StatusBadge;