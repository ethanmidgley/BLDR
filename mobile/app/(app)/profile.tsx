import React, { useEffect, useState } from "react";
import { useQuery } from "@/hooks/useQuery";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { Image } from "expo-image";
import { API_PATH } from "@/hooks/useApi";

type User = {
  fullname: string;
  image: string;
  bio: string;
};

export default function Profile() {
  const { user_id } = useLocalSearchParams<{ user_id: string }>();
  const { data, status } = useQuery<User>("/user/" + user_id);

  return (
    <View key={user_id}>
      {status === "success" ? (
        <>
          {/* main profile div */}
          <View>
            <View style={{ flex: 1 }}>
              <Image
                source={`${API_PATH}/image/${data?.image}`}
                contentFit="cover"
                style={{ width: "100%", height: 400 }}
              />
            </View>

            <Text>{data?.fullname}</Text>

            {/* profile header div */}

            {/* profile picture div */}

            {/* details div */}

            {/* bio div */}
            {/* stats div */}

            {/* uploads div */}
          </View>
        </>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );
}
