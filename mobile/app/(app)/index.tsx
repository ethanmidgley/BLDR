import { FlatList, Text } from "react-native";
import React from "react";
import { useQuery } from "@/hooks/useQuery";
import { Post, PostComponent } from "@/components/PostComponent";

type PostsResponse = {
  next_cursor: number | null;
  posts: Post[];
};

export default function HomeScreen() {
  const { data, status, refetch } = useQuery<PostsResponse>("/posts");

  return (
    <>
      <FlatList
        ListEmptyComponent={() => (
          <Text>Hmmm it's quiet here, maybe create a post.</Text>
        )}
        style={{}}
        refreshing={status === "loading"}
        onRefresh={refetch}
        data={data?.posts}
        onEndReachedThreshold={2}
        onEndReached={async () => {
          if (data?.next_cursor != null) {
            await refetch(
              {
                params: { next_cursor: data?.next_cursor },
              },
              {
                refetchPolicy: (oldData, newData) => ({
                  posts: [...oldData.posts, ...newData.posts],
                  next_cursor: newData.next_cursor,
                }),
              },
            );
          }
        }}
        renderItem={(d) => <PostComponent {...d.item} />}
      />
    </>
  );
}
