import { Link } from "expo-router";
import { router } from "expo-router";
import { styles } from "@/constants/style";
import React from "react";
import { useState } from "react";
import { useSession } from "@/context/context";
import { Alert, Button, Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
  const { signIn } = useSession();
  const [ email, on_change_email ] = React.useState('');
  const [ password, on_change_password ] = React.useState('');

  const test_submitted = () => {
    Alert.alert(`submitted : ${email} ${password}`);
  }

  const submitted = () => {
    signIn();
    router.replace("/");
  }

  return (

    // main div
    <View style = {styles.container}>

      <Image source = {require("../assets/images/icon.png")} style = {styles.image} />

      <Text style = {styles.h1}> Log In </Text>

      <TextInput
        style = {styles.input}
        value = {email}
        onChangeText = {on_change_email}
        placeholder = "e-mail"
        placeholderTextColor = "#ddd"
        keyboardType = "email-address" />

      <TextInput
        style = {styles.input}
        value = {password}
        onChangeText = {on_change_password}
        placeholder = "password"
        placeholderTextColor = "#ddd"
        keyboardType = "visible-password" />

      <TouchableOpacity style = {styles.button} onPress = {submitted}>
        <Text style = {styles.button_text}> Confirm </Text>
      </TouchableOpacity>
      <TouchableOpacity style = {styles.button} onPress = {test_submitted}>
        <Text style = {styles.button_text}> Confirm Test </Text>
      </TouchableOpacity>


      <Text style = {styles.text}> Don't have an account? </Text>
      <Link href={"/register"} style = {styles.link}> Register </Link>
    </View>
  );
}

