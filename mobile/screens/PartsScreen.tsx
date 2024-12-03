import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { getParts } from "../services/api";
import PartsHeader from "../src/components/PartsHeader";
import PartCard from "../src/components/PartCard";
import ErrorMessage from "../src/components/common/ErrorMessage";

interface Part {
  code: string;
  description: string;
  location: string;
  name: string;
  quantity: number;
}

const PartsScreen: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const data = await getParts();
        setParts(data);
        setError(null);
      } catch (err) {
        setError("Erro ao carregar peças.");
      } finally {
        setLoading(false);
      }
    };

    fetchParts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

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

export default PartsScreen;
