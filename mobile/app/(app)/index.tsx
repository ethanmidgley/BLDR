import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";
import { Image } from "expo-image";
import { useSession } from "@/context/context";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { useMutation } from "@/hooks/useMutation";
import React, { useEffect, useState } from "react";
import { useQuery } from "@/hooks/useQuery";
import { API_PATH } from "@/hooks/useApi";

type Climb = {
  time: number;
  level: number;
  lat: number;
  lon: number;
};

type Post = {
  id: number;
  title: string;
  description: string;
  author: string;
  image: string;
  comments: Comment[];
  climb: Climb;
};

type Comment = {
  id: number;
  author: string;
  content: string;
};

type commentResponse = {
  success?: boolean;
  message?: string;
}

const posts = [
  {
    id: 1,
    title: "Scaling the Heights of El Capitan",
    description: "A journey through one of the world's most famous rock faces.",
    author: "Alex Honnold",
    climb: {
      time: 10,
      level: 10,
      lat: 10,
      lon: 10,
    },
    image:
      "https://media.istockphoto.com/id/176053369/photo/view-of-el-capitan-as-seen-from-below.jpg?s=612x612&w=0&k=20&c=5hqa0AkZEEzBre6eEpM7_-UxpNpKEiTO8tzQuoQRPdI=",
    comments: [
      { id: 1, author: "Climber42", content: "This looks incredible!" },
      {
        id: 2,
        author: "MountainGoat",
        content: "Would love to attempt this someday!",
      },
    ],
  },
];

function PostComponent(data: Post) {
  const [comment, setComment] = useState<string>("");
  const [ sendRequest, { data: response } ] = useMutation<commentResponse>("/comments/add");

  const commentOnPost = async () => {
    data.comments.push({ id: Infinity, author: "You", content: comment });
    await sendRequest({ post_id: data.id, content: comment });
    if (response?.message){
      Alert.alert(response.message);
    }
    setComment("");
  };

  return (
    <View style={{ flex: 1, gap: 10 }}>
      <View style={{ flex: 1 }}>
        <Image
          source={`${API_PATH}/image/${data.image}`}
          contentFit="cover"
          style={{ width: "100%", height: 300 }}
        />
      </View>
      <View style={{ flex: 1, gap: 10, padding: 10 }}>
        <Text style={{ fontSize: 22, fontWeight: 700 }}>
          {data.title} - {data.author}
        </Text>
        <Text style={{ textAlign: "justify" }}>{data.description}</Text>
        <Text style={{ fontSize: 18, fontWeight: 600 }}>Comments</Text>

        {data.comments.map((c, idx) => (
          <Text key={idx}>
            {c.content} - {c.author}
          </Text>
        ))}
        <View style={{ flexDirection: "row" }}>
          <TextInput
            placeholder="New comment"
            value={comment}
            onChangeText={(c) => setComment(c)}
            placeholderTextColor={"#ddd"}
            style={{ paddingVertical: 4, flex: 3 }}
          />
          <Ionicons
            name="send-outline"
            onPress={commentOnPost}
            size={24}
            color="black"
          />
        </View>
      </View>
    </View>
  );
}

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
