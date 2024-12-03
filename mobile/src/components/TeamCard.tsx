import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './common/Card';
import { colors, spacing, typography } from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface TeamCardProps {
  name: string;
  members: Array<string | number>;
  specialities: string;
}

const TeamCard: React.FC<TeamCardProps> = ({
  name,
  members,
  specialities,
}) => (
  <Card>
    <View style={styles.header}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.membersCount}>
        <Ionicons name="people" size={16} color={colors.primary.main} />
        <Text style={styles.membersText}>{members.length}</Text>
      </View>
    </View>

    <View style={styles.infoContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Membros</Text>
        <View style={styles.membersList}>
          {members.map((member, index) => (
            <Text key={index} style={styles.memberItem}>• {member}</Text>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Especialidades</Text>
        <Text style={styles.specialities}>{specialities}</Text>
      </View>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  name: {
    ...typography.h2,
    color: colors.text.primary,
  },
  membersCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.default,
    padding: spacing.sm,
    borderRadius: spacing.sm,
    gap: spacing.xs,
  },
  membersText: {
    ...typography.body2,
    color: colors.primary.main,
    fontWeight: '600',
  },
  infoContainer: {
    gap: spacing.md,
  },
  section: {
    gap: spacing.xs,
  },
  sectionTitle: {
    ...typography.body2,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  membersList: {
    gap: spacing.xs,
  },
  memberItem: {
    ...typography.body1,
    color: colors.text.primary,
  },
  specialities: {
    ...typography.body1,
    color: colors.text.primary,
  },
});

export default TeamCard;