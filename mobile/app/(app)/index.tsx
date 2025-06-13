import { FlatList, Text } from "react-native";
import React from "react";
import { useQuery } from "@/hooks/useQuery";
import { Post, PostComponent } from "@/components/PostComponent";

export default function HomeScreen() {
  const { data, status, refetch } = useQuery<Post[]>("/posts/fetch");

  return (
    <>
      <FlatList
        ListEmptyComponent={() => (
          <Text>Hmmm it's quiet here, maybe create a post.</Text>
        )}
        style={{}}
        refreshing={status === "loading"}
        onRefresh={refetch}
        data={data}
        renderItem={(d) => <PostComponent {...d.item} />}
      />
    </>
  );
}
