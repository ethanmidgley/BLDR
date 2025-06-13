import React, { useState } from "react";
import { useMutation } from "@/hooks/useMutation";
import {
  Alert,
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_PATH } from "@/hooks/useApi";
import { Image } from "expo-image";
import Wrapper from "./Wrapper";
import { styles } from "@/constants/style";
import { Link } from "expo-router";
import { useSession } from "@/context/context";
import StatsBar from "./StatsBar";

export type Climb = {
  time: number;
  level: number;
  height: number;
  angle: number;
  type: string;
  success: boolean;
  lat: number;
  lon: number;
};

export type Post = {
  id: number;
  user_id: number;
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
  data: Comment;
};

type PostComponentProps = Post & {
  fullWidth?: boolean;
};

export function PostComponent({
  comments,
  title,
  author,
  description,
  image,
  climb,
  id,
  fullWidth = true,
}: PostComponentProps) {
  const [comment, setComment] = useState<string>("");
  const [sendRequest] = useMutation<commentResponse>("/comments/add");
  const { getUser } = useSession();
  const username = getUser()?.full_name as string;

  const commentOnPost = async () => {
    if (comment === "") {
      Alert.alert("Please write a comment before submitting");
      return;
    }

    const today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    day = Number(day);
    month = Number(month);
    year = Number(year);

    const proper_date = `${year % 1000}/${month < 10 ? "0" + month : month}/${day < 10 ? "0" + day : String(day)}`;

    const { status } = await sendRequest({
      post_id: id,
      content: replyee + comment,
      date: proper_date,
    });

    if (status === "error") {
      Alert.alert("Failed to post comment. Try again later.");
    } else if (status === "success") {
      comments.push({
        id: Infinity,
        author: username,
        content: replyee + comment,
      });
      setPlaceholder("New comment");
      setReplyee("");
    }

    setComment("");
  };

  const [replyee, setReplyee] = useState("");
  const [placeholder, setPlaceholder] = useState("New comment");

  const reply = (c: Comment) => {
    if (c.author === username) {
      setReplyee("(reply to self) ");
      setPlaceholder("(reply to self) ");
    } else {
      setReplyee("(reply to " + c.author + ") ");
      setPlaceholder("(reply to " + c.author + ") ");
    }
  };

  return (
    <View style={{ flex: 1, gap: 10, marginBottom: 10 }}>
      <View style={{ flex: 1 }}>
        <Image
          source={`${API_PATH}/image/${image}`}
          contentFit="cover"
          style={{ width: "100%", height: 400 }}
        />
      </View>
      <Wrapper style={!fullWidth && { marginHorizontal: 0 }}>
        <View style={{ flex: 1, gap: 10 }}>
          <Text style={styles.headingMedium}>
            {title} - {author}
          </Text>
          <Text style={{ textAlign: "justify" }}>{description}</Text>
          <StatsBar climb={climb} />

          <View>
            <TouchableOpacity
              style={{
                backgroundColor: "#f00",
                justifyContent: "center",
                borderRadius: 5,
                paddingVertical: 8,
              }}
            >
              <Link
                href={`https://www.google.com/maps/dir/?api=1&destination=${climb.lat},${climb.lon}`}
                style={styles.button_text}
              >
                Get directions
              </Link>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 2 }}>
            <Text style={styles.headingSmall}>Comments</Text>

            {comments.map((c, idx) => (
              <View key={idx}>
                <Text style={{ paddingRight: 40 }}>
                  {c.author}: {c.content}
                </Text>
                <TouchableOpacity
                  onPress={() => reply(c)}
                  style={styles.reply_button}
                >
                  <Text style={{ color: "#f00", fontSize: 12 }}> Reply </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              placeholder={placeholder}
              value={comment}
              onChangeText={(c) => setComment(c)}
              placeholderTextColor={"#A9A9A9"}
              style={{ paddingVertical: 4, flex: 3 }}
            />
            <Ionicons
              name="close-outline"
              onPress={() => {
                setPlaceholder("New comment");
                setReplyee("");
                setComment("");
              }}
              style={{
                alignSelf: "flex-end",
                padding: 1,
                marginRight: 10,
                borderRadius: 5,
              }}
              size={28}
              color="black"
            />
            <Ionicons
              name="send-outline"
              onPress={commentOnPost}
              size={24}
              color="black"
            />
          </View>
        </View>
      </Wrapper>
    </View>
  );
}
