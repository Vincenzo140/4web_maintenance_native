import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './common/Card';
import { colors, spacing, typography } from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface PartCardProps {
  name: string;
  description: string;
  location: string;
  quantity: number;
}

const PartCard: React.FC<PartCardProps> = ({
  name,
  description,
  location,
  quantity,
}) => (
  <Card>
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityLabel}>Quantidade</Text>
        <Text style={styles.quantityValue}>{quantity}</Text>
      </View>
    </View>
    
    <View style={styles.locationContainer}>
      <Ionicons name="location" size={20} color={colors.primary.main} style={styles.icon} />
      <View>
        <Text style={styles.locationLabel}>Localização</Text>
        <Text style={styles.locationValue}>{location}</Text>
      </View>
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
  description: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  quantityContainer: {
    alignItems: 'center',
    backgroundColor: colors.background.default,
    padding: spacing.sm,
    borderRadius: spacing.sm,
  },
  quantityLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  quantityValue: {
    ...typography.h2,
    color: colors.primary.main,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.sm,
    width: 24,
  },
  locationLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  locationValue: {
    ...typography.body1,
    color: colors.text.primary,
  },
});

export default PartCard;