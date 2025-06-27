import React from "react";
import { useQuery } from "@/hooks/useQuery";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { API_PATH } from "@/hooks/useApi";

export default function Profile() {

  type User = {
    id: number,
    name: string;
    pfp: string;
    bio: string;
  };

  const { user_id } = useLocalSearchParams();
  const { data, status } = useQuery<User>("/users/" + 3);
  const router = useRouter();

  return (
    <>
    {status === "success" ? (
      <>
      {/* main profile div */}
      <View>
        <View style={{ flex:1 }}>
          <Image
            source={`${API_PATH}/image/${data.pfp}`}
            contentFit="cover"
            style={{ width: "100%", height: 400 }}
          />
        </View>

      <Text>
        data.name
      </Text>

        {/* profile header div */}
        
        
          {/* profile picture div */} 

          {/* details div */}

            {/* bio div */}
            {/* stats div */}

        {/* uploads div */}
      
      </View>
      </>) : (
        <ActivityIndicator size="large"/>
      )}
    </>
  );
}
