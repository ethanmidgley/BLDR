import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";
import { useSession } from "@/context/context";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { useQuery } from "@/hooks/useQuery";
import { Post, PostComponent } from "@/components/PostComponent";
import Wrapper from "@/components/Wrapper";

export default function HomeScreen() {
  const { data, status } = useQuery<Post[]>("/posts/fetch");

  return (
    <Wrapper>
      {status === "loading" ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          style={{}}
          data={data}
          renderItem={(d) => <PostComponent {...d.item} />}
        />
      )}
    </Wrapper>
  );
}
