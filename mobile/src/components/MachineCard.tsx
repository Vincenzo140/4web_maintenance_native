import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './common/Card';
import StatusBadge from './common/StatusBadge';
import InfoItem from './common/InfoItem';
import { colors, spacing, typography } from '../theme';

interface MachineCardProps {
  name: string;
  model: string;
  type: string;
  serial_number: string;
  location: string;
  status: string;
}

const MachineCard: React.FC<MachineCardProps> = ({
  name,
  model,
  type,
  serial_number,
  location,
  status,
}) => (
  <Card>
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.model}>{model}</Text>
      </View>
      <StatusBadge status={status} />
    </View>
    
    <View style={styles.infoContainer}>
      <InfoItem icon="cog" label="Tipo" value={type} />
      <InfoItem icon="barcode" label="Número de Série" value={serial_number} />
      <InfoItem icon="location" label="Localização" value={location} />
    </View>
  </Card>
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
  name: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  model: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  infoContainer: {
    gap: spacing.sm,
  },
});

export default MachineCard;