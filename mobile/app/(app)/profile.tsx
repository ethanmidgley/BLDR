import React, { useEffect, useState } from "react";
import { styles } from "@/constants/style";
import { useQuery } from "@/hooks/useQuery";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { API_PATH } from "@/hooks/useApi";
import { Post, PostComponent } from "@/components/PostComponent";

type User = {
  fullname: string;
  image: string;
  bio: string;
};

type UserPostsResponse = {
  next_cursor: number | null;
  posts: Post[];
};

const changeBio = () => {
  
}

export default function Profile() {
  const { user_id } = useLocalSearchParams<{ user_id: string }>();
  const { data, status } = useQuery<User>("/user/" + user_id);
  const { data: postData, status: postStatus, refetch } = useQuery<UserPostsResponse>("/posts/fetchbyuser/" + user_id);

  return (
    <View key={user_id}>
      {status === "success" ? (
        <>
          <FlatList
            ListHeaderComponent={() => (
              <>
          {/* main profile div */}
          <View style={{ width: "100%" }}>
            <View style={{ flex: 1, width:"30%", flexDirection: "row", alignItems: "center", marginHorizontal: 8, marginTop: 14 }}>
              <Image
                source={`${API_PATH}/image/${data?.image}`}
                contentFit="cover"
                style={{ width: "100%", borderRadius: "50%", height: 120, marginLeft: 5, marginTop: 5, borderWidth: 5, borderColor: "#f00"}}
              />

              <View style={{ marginHorizontal: 20, height: 120, width: "190%" }}>
                  <Text style={{ ...styles.headingLarge, textAlign: "center" }}>{data?.fullname}</Text>
              </View>
            </View>

            <View style={{ height: 80, marginHorizontal: 20, marginTop: 15, width: "90%" }}>
              <Text 
                style={{ ...styles.text, textAlign: "justify" }}>{data?.bio}
              </Text>
              <TouchableOpacity
                onPress={() => changeBio()}>
                <Text style={{ ...styles.button_text, color: "#f00", marginTop: 5, marginBottom: 15}}>
                Edit Bio
                </Text>
              </TouchableOpacity>
            </View>

            {/* uploads div */}
            </View>
            </>
            )}
                ListEmptyComponent={() => (
                  <Text style={{ ...styles.headingMedium, paddingTop: 150, textAlign: "center" }}>This user has no posts</Text>
                )}
                style={{}}
                refreshing={postStatus=== "loading"}
                onRefresh={refetch}
                data={postData?.posts}
                onEndReachedThreshold={2}
                onEndReached={async () => {
                  if (postData?.next_cursor != null) {
                    await refetch(
                      {
                        params: { next_cursor: postData?.next_cursor },
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
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );
}
