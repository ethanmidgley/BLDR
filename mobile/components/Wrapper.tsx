import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

export default function Wrapper({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[{ marginHorizontal: 16 }, style]}>{children}</View>;
}
