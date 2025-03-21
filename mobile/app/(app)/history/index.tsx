import { styles } from "@/constants/style";
import { useQuery } from "@/hooks/useQuery";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Button, FlatList, Text, View } from "react-native";

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
};

function ClimbComponent(climb: Climb) {
  const router = useRouter();

  return (
    <View key={climb.id} style={styles.history_container}>
      <Text>Level: v{climb.level}</Text>
      <Text>Time: {climb.time} seconds</Text>
      <Text>Height: {climb.height} meters</Text>

      <Text>Completed: {climb.success ? "Yes" : "No"}</Text>

      <Text>Most Extreme Angle: {climb.angle}</Text>

      {/*TODO: create a link that takes the user to that point on our map */}
      <Link
        style={{ color: "blue" }}
        href={`https://www.google.com/maps/dir/?api=1&destination=${climb.lat},${climb.lon}`}
      >
        Location
      </Link>
      <Button
        title="Post"
        onPress={() =>
          router.push({
            pathname: "/history/post",
            params: { climb_id: climb.id },
          })
        }
      />
    </View>
  );
}

export default function History() {
  const { data } = useQuery<{ data: Climb[] }>("/log/fetch");
  const router = useRouter();
  console.log("HHDH", data);

  return (
    <View>
      <Button
        title="Post"
        onPress={() =>
          router.push({
            pathname: "/history/post",
            params: { climb_id: 1 },
          })
        }
      />
      <FlatList
        style={{}}
        data={data?.data}
        ListFooterComponent={<View style={{ width: 1, height: 150 }}></View>}
        renderItem={(d) => <ClimbComponent {...d.item} />}
      />
    </View>
  );
}
