import React from "react";
import { Climb } from "./PostComponent";
import { StyleSheet, View, Text } from "react-native";

type DisplayInformation = {
  heading: string;
  transform?: (value: any) => any;
};

type keys = keyof Climb;

const StatsDisplayMap: Partial<Record<keys, DisplayInformation>> = {
  level: { heading: "Level", transform: (str) => "v" + str },
  type: { heading: "Type" },
  time: { heading: "Time", transform: (val) => val + "s" },
  success: {
    heading: "Success",
    transform: (v: boolean) => (v ? "Yes" : "No"),
  },
  height: {
    heading: "Height",
    transform: (val) => Math.round(parseInt(val)) + "m",
  },
};

type StatsBarProps = {
  keys?: (keyof Climb)[];
  climb: Climb;
};

export const StatsBar = ({
  climb,
  keys = ["level", "type", "time", "height"],
}: StatsBarProps) => {
  const style = StyleSheet.create({
    box: {
      flexDirection: "column",
      borderColor: "#000",
      justifyContent: "center",
      flex: 1,
      alignItems: "center",
    },
    text: {
      textAlign: "center",
    },
  });

  return (
    <View style={{ flexDirection: "row", width: "100%" }}>
      {keys.map((key, idx) => (
        <View
          key={idx}
          style={[
            style.box,
            idx !== 0 ? { borderLeftWidth: 0.5 } : {},
            idx !== keys.length - 1 ? { borderRightWidth: 0.5 } : {},
          ]}
        >
          <Text style={style.text}>{StatsDisplayMap[key]?.heading}</Text>
          <Text style={style.text}>
            {StatsDisplayMap[key]?.transform
              ? StatsDisplayMap[key].transform(climb[key])
              : climb[key]}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default StatsBar;
