import { Link } from "expo-router";
import { styles } from "@/constants/style";
import React from "react";
import { useState } from "react";
import { useSession } from "@/context/context";
import { Alert, Button, Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Register() {
  const [ full_name, on_change_full_name] = React.useState('');
  const [ email, on_change_email ] = React.useState('');
  const [ password, on_change_password ] = React.useState('');
  const [ confirm_password, on_change_confirm_password ] = React.useState('');

  const register = () => {
    // some api stuff;
  }

  const submitted = () => {
    Alert.alert(`Submitted : ${full_name} ${email} ${password} ${confirm_password}`);
  }

  return (
    // main div
    <View style = {styles.container}>

      <Image source = {require("../assets/images/icon.png")} style = {styles.image} />

      <Text style = {styles.h1}> Register </Text>

      <TextInput
        style = {styles.input}
        value = {full_name}
        onChangeText = {on_change_full_name}
        placeholder = "full name"
        placeholderTextColor = "#ddd"
        keyboardType = "default" />

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

      <TextInput
        style = {styles.input}
        value = {confirm_password}
        onChangeText = {on_change_confirm_password}
        placeholder = "confirm password"
        placeholderTextColor = "#ddd"
        keyboardType = "visible-password" />


      <TouchableOpacity style = {styles.button} onPress = {submitted}>
        <Text style = {styles.button_text}> Register </Text>
      </TouchableOpacity>

      <Text style = {styles.text}> Already have an account? </Text>
      <Link href={"/login"} style = {styles.link}> Log In </Link>
    </View>
  );
}
