import { Alert, Button, FlatList, Text, View } from "react-native";
import { Image } from "expo-image";

import { useSession } from "@/context/context";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import React, { useState } from "react";

type Post = {
  id: number;
  title: string;
  description: string;
  author: string;
  uri: string;
  comments: Comment[];
};

type Comment = {
  id: number;
  author: string;
  content: string;
};

const posts = [
  {
    id: 1,
    title: "Scaling the Heights of El Capitan",
    description: "A journey through one of the world's most famous rock faces.",
    author: "Alex Honnold",
    uri: "https://media.istockphoto.com/id/176053369/photo/view-of-el-capitan-as-seen-from-below.jpg?s=612x612&w=0&k=20&c=5hqa0AkZEEzBre6eEpM7_-UxpNpKEiTO8tzQuoQRPdI=",
    comments: [
      { id: 1, author: "Climber42", content: "This looks incredible!" },
      {
        id: 2,
        author: "MountainGoat",
        content: "Would love to attempt this someday!",
      },
    ],
  },
  {
    id: 2,
    title: "Bouldering in Fontainebleau",
    description: "Exploring the legendary boulders of France.",
    author: "Lisa Rands",
    uri: "https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2014/8/27/1409148180693/69763bf6-63b8-4f2b-ba1b-be49a4f5d6a9-1024x768.jpeg?width=1900&dpr=2&s=none&crop=none",
    comments: [],
  },
  {
    id: 3,
    title: "The Art of Crack Climbing",
    description: "Mastering the technique of jamming your way up the rock.",
    author: "Tom Randall",
    uri: "https://t3.ftcdn.net/jpg/05/87/54/76/360_F_587547676_FgUTUvNLH8sWRibVoTqxTuDgpnfWa5KP.jpg",
    comments: [
      {
        id: 3,
        author: "CrackMaster",
        content: "Great tips for improving my technique!",
      },
    ],
  },
  {
    id: 4,
    title: "Deep Water Soloing in Mallorca",
    description: "Climbing above the sea without ropes—just you and the rock.",
    author: "Chris Sharma",
    uri: "https://awe365.com/wp-content/uploads/2020/05/Jan-Mallorca-1-DWS.jpg",
    comments: [
      { id: 4, author: "SoloKing", content: "That overhang looks gnarly!" },
      { id: 6, author: "WaveRider", content: "Hope you had a good swim!" },
    ],
  },
  {
    id: 5,
    title: "Ice Climbing in the Alps",
    description: "Facing the cold challenge of vertical ice.",
    author: "Will Gadd",
    uri: "https://undiscoveredmountains.com/uploads/gallery/16/Ice-Climbing--1184-lt.jpg",
    comments: [{ id: 5, author: "BBL Drizzy", content: "Dayammm that ass" }],
  },
  {
    id: 6,
    title: "Trad Climbing at Joshua Tree",
    description: "The beauty and challenge of placing your own protection.",
    author: "Steph Davis",
    uri: "https://57hours.com/wp-content/uploads/2020/10/rock-climbing-tour-in-joshua-tree.jpg",
    comments: [
      {
        id: 7,
        author: "TradDad",
        content: "Nothing beats the feeling of clean gear placements.",
      },
      { id: 8, author: "DesertRat", content: "Such an iconic spot!" },
      {
        id: 9,
        author: "RockLover",
        content: "That splitter crack is calling my name!",
      },
      { id: 10, author: "OldSchool", content: "This is real climbing." },
    ],
  },
  {
    id: 7,
    title: "Sport Climbing in Kalymnos",
    description: "Bolted routes and stunning limestone cliffs.",
    author: "Adam Ondra",
    uri: "https://rockandsun.com/wp-content/uploads/2018/10/Kalymnos-Climbing-Holiday-9-660x500_c.jpg",
    comments: [
      {
        id: 11,
        author: "OnsightQueen",
        content: "Best limestone routes in the world!",
      },
    ],
  },
  {
    id: 8,
    title: "The Sharp End: Climbing Without Limits",
    description: "Pushing mental and physical boundaries in climbing.",
    author: "Hazel Findlay",
    uri: "https://57hours.com/wp-content/uploads/2021/09/spain-rock-climbing.jpg",
    comments: [
      { id: 12, author: "Fearless", content: "Mindset is everything!" },
      { id: 13, author: "SendIt", content: "Epic read!" },
      { id: 14, author: "CruxCrusher", content: "So inspiring." },
    ],
  },
  {
    id: 9,
    title: "The Hardest Routes in the World",
    description: "Exploring the limits of human ability in climbing.",
    author: "Magnus Midtbø",
    uri: "https://img.redbull.com/images/q_auto,f_auto/redbullcom/2019/11/29/0e707d48-39bb-4c78-901f-9ee04d592ea2/tommy-caldwell-el-capitan-climb",
    comments: [
      {
        id: 15,
        author: "ProjectSeeker",
        content: "One day I'll send one of these...",
      },
      { id: 16, author: "BetaMaster", content: "Such crazy moves!" },
    ],
  },
];

function PostComponent(data: Post) {
  const [comment, setComment] = useState<string>("");

  const commentOnPost = () => {
    data.comments.push({ id: Infinity, author: "You", content: comment });
    setComment("");
  };

  return (
    <View style={{ flex: 1, gap: 10 }}>
      <View style={{ flex: 1 }}>
        <Image
          source={data.uri}
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
      <FlatList
        style={{}}
        data={posts}
        ListFooterComponent={<View style={{ width: 1, height: 150 }}></View>}
        // keyExtractor={(p) => p.id}
        renderItem={(d) => <PostComponent {...d.item} />}
      />
    </View>
  );
}
