import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './common/Card';
import { colors, spacing, typography } from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface MaintenanceCardProps {
  problemDescription: string;
  requestDate: string;
  priority: string;
  assignedTeam: string;
  status: string;
  machineId: string;
}

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'alta':
      return colors.status.broken;
    case 'média':
      return colors.status.maintenance;
    case 'baixa':
      return colors.status.operational;
    default:
      return colors.text.disabled;
  }
};

const MaintenanceCard: React.FC<MaintenanceCardProps> = ({
  problemDescription,
  requestDate,
  priority,
  assignedTeam,
  status,
  machineId,
}) => (
  <Card>
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={styles.description}>{problemDescription}</Text>
        <Text style={styles.date}>Solicitado em: {requestDate}</Text>
      </View>
      <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(priority) }]}>
        <Text style={styles.priorityText}>{priority}</Text>
      </View>
    </View>
    
    <View style={styles.infoContainer}>
      <InfoItem icon="people" label="Equipe" value={assignedTeam} />
      <InfoItem icon="stats-chart" label="Status" value={status} />
      <InfoItem icon="construct" label="Máquina ID" value={machineId} />
    </View>
  </Card>
);

const InfoItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.infoItem}>
    <Ionicons name={icon} size={20} color={colors.primary.main} style={styles.icon} />
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  description: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  date: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
  },
  priorityText: {
    ...typography.caption,
    color: colors.background.paper,
    fontWeight: '600',
  },
  infoContainer: {
    gap: spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.sm,
    width: 24,
  },
  label: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  value: {
    ...typography.body1,
    color: colors.text.primary,
  },
});

export default MaintenanceCard;