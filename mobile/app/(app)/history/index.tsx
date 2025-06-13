import StatsBar from "@/components/StatsBar";
import Wrapper from "@/components/Wrapper";
import { styles } from "@/constants/style";
import { useQuery } from "@/hooks/useQuery";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, Vibration } from "react-native";
import { FlatList, Text, View } from "react-native";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";

type Climb = {
  id: number;
  user_id: number;
  type: string;
  time: number;
  level: number;
  success: boolean;
  angle: number;
  lat: number;
  lon: number;
  height: number;
  date: Date;
  posted: boolean;
};

function ClimbComponent(climb: Climb) {
  const router = useRouter();
  
  return (
    <View key={climb.id} style={{ marginBottom: 20, gap: 10 }}>
      <View style={{ height: 200, width: "100%" }}>
        <MapView
          style={{ flex: 1 }}
          provider={
            process.env.environment === "preview"
              ? PROVIDER_GOOGLE
              : PROVIDER_DEFAULT
          }
          initialRegion={{
            latitude: climb.lat,
            longitude: climb.lon,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          zoomEnabled={false}
          zoomTapEnabled={false}
          rotateEnabled={false}
          scrollEnabled={false}
        >
          <Marker coordinate={{ latitude: climb.lat, longitude: climb.lon }} />
        </MapView>
      </View>
      <Text style={styles.headingSmall}>
        {new Date(climb.date).toDateString()}
      </Text>

      <StatsBar keys={["level", "type", "time"]} climb={climb} />
      <StatsBar keys={["angle", "success", "height"]} climb={climb} />

      {!climb.posted ? (
        <TouchableOpacity
          style={{
            backgroundColor: "#f00",
            justifyContent: "center",
            borderRadius: 5,
            paddingVertical: 8,
          }}
          onPress={() => {
            Vibration.vibrate(50);
            router.push({
              pathname: "/history/post",
              params: {
                climb_id: climb.id,
              },
            });
          }}
        >
          <Text style={styles.button_text}>Post</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default function History() {
  const { data, refetch } = useQuery<{ data: Climb[] }>("/log/fetch");
  const [refreshing] = useState<boolean>(false);
  const {refresh} = useLocalSearchParams();
  
  useEffect(() => {
    // console.log(refresh)
    if (refresh == "1") {
      refetch();
    }
  }, [refresh, refetch]);

  
  return (
    <Wrapper>
      <FlatList
        ListEmptyComponent={() => (
          <Text>Log a climb to see it in your history</Text>
        )}
        ListHeaderComponent={() => (
          <Text style={{ ...styles.headingMedium, paddingVertical: 15 }}>
            Your previous climbs
          </Text>
        )}
        style={{}}
        data={data?.data}
        refreshing={refreshing}
        onRefresh={refetch}
        renderItem={(d) => <ClimbComponent {...d.item} />}
      />
    </Wrapper>
  );
}
