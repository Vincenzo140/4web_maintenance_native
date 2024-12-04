import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useParts } from "../hooks/useParts";
import PartsHeader from "../components/PartsHeader";
import PartCard from "../components/PartCard";
import ErrorMessage from "../components/ErrorMessage";
import LoadingIndicator from "../components/LoadingIndicator";
import { colors } from "../theme";

const PartsScreen: React.FC = () => {
  const { parts, loading, error } = useParts();

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <FlatList
      data={parts}
      keyExtractor={(item) => item.code}
      renderItem={({ item }) => (
        <PartCard
          name={item.name}
          description={item.description}
          location={item.location}
          quantity={item.quantity}
        />
      )}
      contentContainerStyle={styles.list}
      ListHeaderComponent={<PartsHeader />}
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

export default PartsScreen;