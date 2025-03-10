import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Post = {
  id: number;
  title: string;
  description: string;
  author: string;
  uri: string | null;
};

const PostClimbScreen = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("Placeholder User");
  const [uri, setUri] = useState<string | null>(null);

  const handleChooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setUri(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!title || !description || !uri) {
      Alert.alert(
        "Missing Info",
        "Please Fill in all fields and select an image",
      );
      return;
    }

    const newPost: Post = {
      id: Date.now(),
      title,
      description,
      author,
      uri,
    };

    try {
      const existingPosts = await AsyncStorage.getItem("boulderingPosts");
      const posts: Post[] = existingPosts ? JSON.parse(existingPosts) : [];
      posts.push(newPost);
      await AsyncStorage.setItem("boulderingPosts", JSON.stringify(posts));

      Alert.alert("Success", "Post Created");
      setTitle("");
      setDescription("");
      setUri(null);
    } catch (error) {
      console.error("Error Posting", error);
      Alert.alert("Error", "Failed to post");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          Climbed a{" "}
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.icon}
          />{" "}
          Post it !!
        </Text>
      </View>
      <Text style={styles.label}>Title:</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <View style={styles.imageContainer}>
        <Button title="Choose Image" onPress={handleChooseImage} />
        {uri && <Image source={{ uri: uri }} style={styles.image} />}
      </View>

      <Button title="Create Post" onPress={handlePost} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    minHeight: 40,
    textAlignVertical: "top",
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    resizeMode: "contain",
  },
  banner: {
    backgroundColor: "grey",
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  bannerText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
});

export default PostClimbScreen;
