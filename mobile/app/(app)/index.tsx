import { ActivityIndicator, FlatList } from "react-native";
import React, { useState } from "react";
import { useQuery } from "@/hooks/useQuery";
import { Post, PostComponent } from "@/components/PostComponent";

export default function HomeScreen() {
  const { data, status, refetch } = useQuery<Post[]>("/posts/fetch");
  const [refreshing] = useState<boolean>(false);

  return (
    <>
      {status === "loading" ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          style={{}}
          refreshing={refreshing}
          onRefresh={refetch}
          data={data}
          renderItem={(d) => <PostComponent {...d.item} />}
        />
      )}
    </>
  );
}
