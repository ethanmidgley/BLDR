import { Link, router } from "expo-router";
import { styles } from "@/constants/style";
import React from "react";
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
import { useMutation } from "@/hooks/useMutation";

type UserType = {
  id: number;
  fullname: string;
  email: string;
  password: string;
};

type RegisterResponse = {
  data: {
    user: UserType;
  };
};

export default function Register() {
  const [full_name, on_change_full_name] = React.useState("");
  const [email, on_change_email] = React.useState("");
  const [password, on_change_password] = React.useState("");
  const [confirm_password, on_change_confirm_password] = React.useState("");

  const [register, { status }] =
    useMutation<RegisterResponse>("/users/register");

  const submitForm = async () => {
    if (full_name.length < 1 || full_name.length > 32) {
      Alert.alert(
        "Full name is invalid length. Must be between 1 and 32 characters long",
      );
      return;
    }

    const email_validate = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
    if (!email_validate.test(email)) {
      Alert.alert("Invalid email");
      return;
    }

    if (password.length < 8 || password.length > 32) {
      Alert.alert(
        "Password is invalid length. Must be between 8 and 32 characters long",
      );
      return;
    }

    if (password !== confirm_password) {
      Alert.alert("Passwords do not match");
      return;
    }

    const { status } = await register({
      email: email,
      fullname: full_name,
      password: password,
    });

    if (status === "success") {
      Alert.alert("Welcome to BLDR");
      router.replace("/login");
    } else {
      Alert.alert("Failed to created account, try again later");
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
          onPress={submitForm}
          disabled={status === "loading"}
        >
          {status !== "loading" ? (
            <Text style={styles.button_text}> Register </Text>
          ) : (
            <ActivityIndicator />
          )}
        </TouchableOpacity>

        <Text style={styles.text}> Already have an account? </Text>
        <Link href={"/login"} style={styles.link}>
          {" "}
          Log In{" "}
        </Link>
      </View>
    </SafeAreaView>
  );
}
