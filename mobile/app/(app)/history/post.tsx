import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { API_PATH } from "@/hooks/useApi";
import { styles } from "@/constants/style"

const PostClimbScreen = () => {
  const router = useRouter();
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
      Alert.alert(
        "Missing Info",
        "Please fill in all fields and select an image.",
      );
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

      const date = `${year % 1000}/${month < 10 ? "0" + month : month}/${day < 10 ? "0" + day : String(day)} `;
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("climb_id", climb_id);
      formData.append("date", date);
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
      // API redone
      const response = await fetch(API_PATH + "/posts/add", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert("Post Created", "Your post has been successfully created!");
        router.push({
          pathname: "/history",
          params: { refresh: "refresh" },
        });
      } else {
        Alert.alert("Error", responseData.error || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to post data. Please try again.");
    }
  };

  return (
    <ScrollView>
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
      <View style ={{marginHorizontal:20}}>
        <Text style={{fontSize: 16, marginVertical:5}}>Title:</Text>
        <TextInput style={{...styles.input,width:"100%"}} value={title} onChangeText={setTitle} />

        <Text style={{fontSize:16, marginVertical:5}}>Description:</Text>
        <TextInput
          editable
          multiline
          style={{...styles.input,width:"100%",height:100,}}
          value={description}
          onChangeText={setDescription}
        />
      </View>
      
      <TouchableOpacity 
        style={{
          backgroundColor: "#f00", 
          justifyContent: "center", 
          borderRadius: 5, 
          paddingVertical: 8,
          alignSelf:"center",
          padding:10,
          margin:10,
          width:"70%",
          height:50,
          }}
        onPress={handleChooseImage}
        
        >
        <Text style = {styles.button_text}>Choose Image</Text>
      </TouchableOpacity>
      {uri && <Image source={{ uri: uri }} style={{...styles.image,alignSelf:"center"}} />}

      <TouchableOpacity 
        style={{
          backgroundColor: "#f00", 
          justifyContent: "center", 
          borderRadius: 5, 
          paddingVertical: 8,
          alignSelf:"center",
          padding:10,
          margin:10,
          width:"55%",
          height:50,
          }}
        onPress={handlePost}
        
        >
        <Text style = {styles.button_text}>Create Post</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PostClimbScreen;
