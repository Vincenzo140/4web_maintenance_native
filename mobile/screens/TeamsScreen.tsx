import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { getTeams } from "../services/api";
import TeamsHeader from "../src/components/TeamsHeader";
import TeamCard from "../src/components/TeamCard";
import ErrorMessage from "../src/components/common/ErrorMessage";

interface Team {
  team_id?: string;
  name: string;
  members: Array<string | number>;
  specialities: string; // Alterado para string
}

const TeamsScreen: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await getTeams();
        console.log("Teams fetched:", data);
        setTeams(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Erro ao carregar equipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1565C0" />
      </View>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#F5F5F5",
  },
});

export default TeamsScreen;
