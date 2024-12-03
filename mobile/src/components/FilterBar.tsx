import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface FilterBarProps {
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
  totalMachines: number;
}

const filters = ['Todos', 'Operacional', 'Em Manutenção', 'Quebrada', 'Desativada'];

const FilterBar: React.FC<FilterBarProps> = ({
  selectedFilter,
  onSelectFilter,
  totalMachines,
}) => (
  <View style={styles.container}>
    <Text style={styles.total}>{totalMachines} máquinas</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.selectedFilter,
            ]}
            onPress={() => onSelectFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.selectedFilterText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.paper,
    paddingVertical: spacing.sm,
  },
  total: {
    ...typography.body2,
    color: colors.text.secondary,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  scrollView: {
    flexGrow: 0,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.lg,
    backgroundColor: colors.background.default,
  },
  selectedFilter: {
    backgroundColor: colors.primary.main,
  },
  filterText: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  selectedFilterText: {
    color: colors.background.paper,
    fontWeight: '600',
  },
});

export default FilterBar;