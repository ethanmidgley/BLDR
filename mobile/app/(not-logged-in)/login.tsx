import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Login() {
  return (
    <View>
      <Text>Login page</Text>
      <Link href={"/register"}>Go to register page</Link>
    </View>
  );
}
