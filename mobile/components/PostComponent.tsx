import React, { useState } from "react";
import { useMutation } from "@/hooks/useMutation";
import { Alert, TextInput, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_PATH } from "@/hooks/useApi";
import { Image } from "expo-image";

export type Climb = {
  time: number;
  level: number;
  lat: number;
  lon: number;
};

export type Post = {
  id: number;
  title: string;
  description: string;
  author: string;
  image: string;
  comments: Comment[];
  climb: Climb;
};

export type Comment = {
  id: number;
  author: string;
  content: string;
};

export type commentResponse = {
  success?: boolean;
  message?: string;
};

export function PostComponent(data: Post) {
  const [comment, setComment] = useState<string>("");
  const [sendRequest, { data: response }] =
    useMutation<commentResponse>("/comments/add");

  const commentOnPost = async () => {
    data.comments.push({ id: Infinity, author: "You", content: comment });
    const today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    day = Number(day);
    month = Number(month);
    year = Number(year);
    const proper_date = `${day < 10 ? '0' + day : String(day)}/${month < 10 ? '0' + month : month}/${year % 1000}`;
    await sendRequest({ post_id: data.id, content: comment, date: proper_date });
    if (response?.message) {
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
