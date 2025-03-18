import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";
import { useSession } from "@/context/context";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { useQuery } from "@/hooks/useQuery";
import { Post, PostComponent } from "@/components/PostComponent";

export default function HomeScreen() {
  const { signOut } = useSession();

  const { data, status } = useQuery<Post[]>("/posts/fetch");

  const confirmSignOut = () => {
    Alert.alert("Logout?", "Are you sure you sure you want to log out?", [
      {
        text: "No",
      },
      {
        text: "Yes",
        onPress: signOut,
      },
    ]);
  };

  return (
    <View>
      <View
        style={{
          backgroundColor: "#fff",
          flexDirection: "row",
          padding: 10,
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <Text style={{ fontSize: 32, fontWeight: "700" }}>BLDR</Text>
        <AntDesign
          onPress={confirmSignOut}
          name="logout"
          size={24}
          color="black"
        />
      </View>
      {status === "loading" ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          style={{}}
          data={data}
          ListFooterComponent={<View style={{ width: 1, height: 150 }}></View>}
          renderItem={(d) => <PostComponent {...d.item} />}
        />
      )}
    </View>
  );
}
