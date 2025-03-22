import { ActivityIndicator, FlatList } from "react-native";
import React from "react";
import { useQuery } from "@/hooks/useQuery";
import { Post, PostComponent } from "@/components/PostComponent";

export default function HomeScreen() {
  const { data, status } = useQuery<Post[]>("/posts/fetch");

  return (
    <>
      {status === "loading" ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          style={{}}
          data={data}
          renderItem={(d) => <PostComponent {...d.item} />}
        />
      )}
    </>
  );
}
