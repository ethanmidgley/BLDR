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
import { useLocalSearchParams } from "expo-router";

const PostClimbScreen = () => {
  const { climb_id } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uri, setUri] = useState<string | null>(null);


  const handleChooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setUri(imageUri);
    }
  };

  const handlePost = async () => {
    if (!title || !description || !uri) {
      Alert.alert("Missing Info", "Please fill in all fields and select an image.");
      return;
    }

    try {
      const today = new Date();
      let day = today.getDate();
      let month = today.getMonth() + 1;
      let year = today.getFullYear();
      day = Number(day);
      month = Number(month);
      year = Number(year);

      const date = `${day < 10 ? "0" + day : String(day)}/${month < 10 ? "0" + month : month}/${year % 1000}`;
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("climb_id", climb_id);
      formData.append("date",date)
      //image upload stuff
      const localUri = uri;
      const filename = localUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename || "");
      const type = match ? `image/${match[1]}` : "image";

      formData.append("image", {
        uri: localUri,
        name: filename,
        type: type,
      });
      console.log(formData)
      // API redone
      const response = await fetch("https://devweb2024.cis.strath.ac.uk/mhb22136-nodejs/posts/add", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
      
      const responseData = await response.json();

      if (response.ok) {
        Alert.alert("Post Created", "Your post has been successfully created!");
      } else {
        Alert.alert("Error", responseData.error || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to post data. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          CLIMBED A
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.icon}
          />{" "}
          ?
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
    borderRadius: 4,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  bannerText: {
    fontStyle: "italic",
    color: "red",
    fontSize: 31,
    fontWeight: "bold",
    fontFamily: "Archivo_700Bold_Italic",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "black",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "flex-end",
    flexGrow: 1,
  },
  icon: {
    width: 80,
    height: 27,
    resizeMode: "contain",
    paddingTop: 3,
  },
  buttonContainer: {
    marginTop: 20,
    justifyContent: "flex-end",
    flexGrow: 1,
  },
});

export default PostClimbScreen;
