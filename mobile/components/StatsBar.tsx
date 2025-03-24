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
  angle: {
    heading: "Extreme Angle",
    transform: (val) => Math.round(val) + "°",
  },
  type: { heading: "Type" },
  time: { heading: "Time", transform: (val) => val + "s" },
  success: {
    heading: "Success",
    transform: (v: boolean) => (v ? "Yes" : "No"),
  },
  height: { heading: "Height", transform: (val) => Math.round(val) + "m" },
};

type StatsBarProps = {
  keys?: (keyof Climb)[];
  climb: Climb;
};

export const StatsBar = ({
  climb,
  keys = ["level", "type", "time", "angle"],
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

{
  /**/
}
{
  /* <View */
}
{
  /*   style={[ */
}
{
  /*     style.box, */
}
{
  /*     { */
}
{
  /*       borderLeftWidth: 0.5, */
}
{
  /*       borderRightWidth: 0.5, */
}
{
  /*     }, */
}
{
  /*   ]} */
}
{
  /* > */
}
{
  /*   <Text style={style.text}>Type</Text> */
}
{
  /*   <Text style={style.text}>{stats.type}</Text> */
}
{
  /* </View> */
}
{
  /* <View */
}
{
  /*   style={[ */
}
{
  /*     style.box, */
}
{
  /*     { */
}
{
  /*       borderRightWidth: 0.5, */
}
{
  /*       borderLeftWidth: 0.5, */
}
{
  /*     }, */
}
{
  /*   ]} */
}
{
  /* > */
}
{
  /*   <Text style={style.text}>Time</Text> */
}
{
  /*   <Text style={style.text}>{stats.time}s</Text> */
}
{
  /* </View> */
}
{
  /* <View */
}
{
  /*   style={[ */
}
{
  /*     style.box, */
}
{
  /*     { */
}
{
  /*       borderLeftWidth: 0.5, */
}
{
  /*     }, */
}
{
  /*   ]} */
}
{
  /* > */
}
{
  /*   <Text style={style.text}>Extreme Angle</Text> */
}
{
  /*   <Text style={style.text}>{Math.round(stats.angle)}°</Text> */
}
{
  /* </View> */
}
