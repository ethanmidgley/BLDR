import { Link, router } from "expo-router";
import { styles } from "@/constants/style";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { API_PATH } from "@/hooks/useApi";
import { AntDesign, Ionicons } from "@expo/vector-icons";

export default function Register() {
  const [full_name, on_change_full_name] = React.useState("");
  const [email, on_change_email] = React.useState("");
  const [password, on_change_password] = React.useState("");
  const [confirm_password, on_change_confirm_password] = React.useState("");
  const [uri, setUri] = useState<string | null>(null);
  const [image_flag, set_image_flag] = useState(false);

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

  const submitForm = async () => {
    if (full_name.length < 1 || full_name.length > 32) {
      Alert.alert(
        "Full name is invalid length. Must be between 1 and 32 characters long",
      );
      set_image_flag(false);
      return;
    }

    const email_validate = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
    if (!email_validate.test(email)) {
      Alert.alert("Invalid email");
      set_image_flag(false);
      return;
    }

    if (password.length < 8 || password.length > 32) {
      Alert.alert(
        "Password is invalid length. Must be between 8 and 32 characters long",
      );
      set_image_flag(false);
      return;
    }

    if (password !== confirm_password) {
      Alert.alert("Passwords do not match");
      set_image_flag(false);
      return;
    }

    if (uri === "") {
      Alert.alert("Please upload an image");
      set_image_flag(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullname", full_name);
      formData.append("email", email);
      formData.append("password", password);

      // image upload stuff
      const localUri = uri;
      const filename = localUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename || "");
      const type = match ? `image/${match[1]}` : "image";

      formData.append("image", {
        uri: localUri,
        name: filename,
        type: type,
      });

      const response = await fetch(API_PATH + "/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert("Welcome to BLDR");
        router.replace("/login");
      } else {
        Alert.alert("Error", responseData.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to post data. Please try again.");
    }
  };

  return (
    // main div
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.image}
        />

        <Text style={styles.h1}> Register </Text>

        {!image_flag ? (
          <>
            <TextInput
              style={styles.input}
              value={full_name}
              onChangeText={on_change_full_name}
              placeholder="full name"
              placeholderTextColor="#ddd"
              keyboardType="default"
            />

            <TextInput
              style={styles.input}
              value={email}
              onChangeText={on_change_email}
              placeholder="e-mail"
              placeholderTextColor="#ddd"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              value={password}
              onChangeText={on_change_password}
              placeholder="password"
              placeholderTextColor="#ddd"
              keyboardType="default"
              autoCapitalize="none"
              secureTextEntry={true}
            />

            <TextInput
              style={styles.input}
              value={confirm_password}
              onChangeText={on_change_confirm_password}
              placeholder="confirm password"
              placeholderTextColor="#ddd"
              // keyboardType="visible-password"
              secureTextEntry={true}
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => set_image_flag(true)}
            >
              <Text style={styles.button_text}> Next </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={{
                backgroundColor: "#f00",
                justifyContent: "center",
                borderRadius: 5,
                paddingVertical: 8,
                alignSelf: "center",
                padding: 10,
                margin: 10,
                width: "70%",
                height: 50,
              }}
              onPress={handleChooseImage}
            >
              <Text style={{ ...styles.button_text, color: "#fff" }}>
                Select a profile picture!
              </Text>
            </TouchableOpacity>
            {uri && (
              <Image
                source={{ uri: uri }}
                style={{ ...styles.image, alignSelf: "center" }}
              />
            )}

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={{
                  ...styles.button,
                  backgroundColor: "#000",
                  height: 50,
                }}
                onPress={() => set_image_flag(false)}
              >
                <Text style={styles.button_text}> Back </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ ...styles.button, height: 50, marginHorizontal: 5 }}
                onPress={submitForm}
              >
                <Text style={styles.button_text}> Register </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        <Text style={styles.text}> Already have an account? </Text>
        <Link href={"/login"} style={styles.link}>
          {" "}
          Log In{" "}
        </Link>
      </View>
    </SafeAreaView>
  );
}
