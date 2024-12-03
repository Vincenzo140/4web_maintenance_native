import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useTeams } from "../hooks/useTeams";
import TeamsHeader from "../components/TeamsHeader";
import TeamCard from "../components/TeamCard";
import ErrorMessage from "../components/ErrorMessage";
import LoadingIndicator from "../components/LoadingIndicator";
import { colors } from "../theme";

const TeamsScreen: React.FC = () => {
  const { teams, loading, error } = useTeams();

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <FlatList
      data={teams}
      keyExtractor={(item) => item.team_id || item.name}
      renderItem={({ item }) => (
        <TeamCard
          name={item.name}
          members={item.members}
          specialities={item.specialities}
        />
      )}
      contentContainerStyle={styles.list}
      ListHeaderComponent={<TeamsHeader />}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.background.default,
  },
});

export default TeamsScreen;