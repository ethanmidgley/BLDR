import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Register() {
  return (
    <View>
      <Text>Register page</Text>
      <Link href={"/login"}>Go to log in page</Link>
    </View>
  );
}
