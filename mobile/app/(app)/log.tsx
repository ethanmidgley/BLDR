import { useState } from "react";
import { View, Text } from "react-native";

export default function Log() {


  const [count, setCount] = useState(0);

  return (
    <View>

      <Text style={{ color: "#ff0000" }}>Log page</Text>
      <Text> Kierans Job 🤓 </Text>
      <Text>Date: {count} </Text> 
      <Text onPress={() => {setCount(count + 1)}}>INcrement</Text> 
    </View>
  );
}
