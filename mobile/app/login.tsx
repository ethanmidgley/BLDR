import { useSession } from "@/context/context";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import {router } from "expo-router";

export default function Login() {

  const {signIn} = useSession();

  return (
    <View>
      <Text>Login page</Text>
      <Text onPress={() => {
        signIn();
        router.replace("/");
      }}>LOGIN SECURELY MAGICALLY</Text>
      <Link href={"/register"}>Go to register page</Link>
    </View>
  );
}
