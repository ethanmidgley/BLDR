import { Link } from "expo-router";
import { styles } from "@/constants/style";
import React from "react";
import { useSession } from "@/context/context";
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const { signIn } = useSession();
  const [email, on_change_email] = React.useState("");
  const [password, on_change_password] = React.useState("");

  const submitted = () => {
    signIn(email, password);
  };

  return (
    // main div
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.image}
        />

        <Text style={styles.h1}> Log In </Text>

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
          secureTextEntry={true} 
          keyboardType="default" 
          autoCapitalize="none"  
        />

        <TouchableOpacity style={styles.button} onPress={submitted}>
          <Text style={styles.button_text}> Confirm </Text>
        </TouchableOpacity>

        <Text style={styles.text}> Don't have an account? </Text>
        <Link href={"/register"} style={styles.link}>
          {" "}
          Register{" "}
        </Link>
      </View>
    </SafeAreaView>
  );
}
