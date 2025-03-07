import { useState } from "react";
import { View, Text, Button } from "react-native";
import React from "react";

const dates = ["01/01/01", "02/02/02", "03/03/03"];
const names = ["jeff", "test", "name 3"];

const data = [{name: "hello", date: "11/02/12"}]

export default function Log() {
  const [show, setShow] = useState(false);

  const showNames = () => {
    setShow(true);
  };
  const hideNames = () => {
    setShow(false)
  }

  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <Button
            onPress={showNames}
            title="History"
            color="black"
            accessibilityLabel="Look at your history"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            onPress={hideNames}
            title="Record"
            color="black"
            accessibilityLabel="Record your scores manually or with inbuilt technology"
          />
        </View>



      </View>

      {show && (
          <View style= {{padding: 10}}>
            {names.map((name, index) => (
              <View key={index}>
              <Text >
                {"\n"}
                {name} - {dates[index]}
              </Text>
              <Text>Time: </Text>
              <Text>
                Height: 
                {"\n"}
              </Text>
              
              </View>
              ))}
          </View>
        )}

    </View>
  );
}
