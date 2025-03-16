import { useState } from "react";
import { View, Text, Image, Alert, TouchableOpacity } from "react-native";
import React from "react";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { styles } from "@/constants/style";
import { useQuery } from "../../hooks/useQuery";
import { Link } from "expo-router";

const dates = ["01/01/01", "02/02/02", "03/03/03"];
const names = ["jeff", "test", "name 3"];

type Climb = {
  id: number;
  user_id: number;
  type: string;
  time: number;
  level: number;
  success: boolean;
  angle: number;
  lat: number;
  lon: number;
  height: number;
};

function ClimbComponent(climb: Climb) {
  return (
    <View key={climb.id} style={styles.history_container}>
      <Text>Level: v{climb.level}</Text>
      <Text>Time: {climb.time} seconds</Text>
      <Text>Height: {climb.height} meters</Text>

      <Text>Completed: {climb.success ? "Yes" : "No"}</Text>

      <Text>Most Extreme Angle: {climb.angle}</Text>

      {/*TODO: create a link that takes the user to that point on our map */}
      <Link
        style={{ color: "blue" }}
        href={`https://www.google.com/maps/dir/?api=1&destination=${climb.lat},${climb.lon}`}
      >
        Location
      </Link>
    </View>
  );
}

export default function Log() {
  const [show, setShow] = useState(false);
  const [day, onChangeDay] = React.useState("");
  const [month, onChangeMonth] = React.useState("");
  const [year, onChangeYear] = React.useState("");
  const [location, onChangeLocation] = React.useState("");
  const [level, onChangeLevel] = React.useState("");
  const [time, onChangeTime] = React.useState("");
  const [height, onChangeHeight] = React.useState("");

  const showHitory = () => {
    setShow(true);
  };

  const showRecord = () => {
    setShow(false);
  };

  const capValues = () => {
    if (parseInt(day) > 31) onChangeDay("31");
    if (parseInt(month) > 12) onChangeMonth("12");
    if (parseInt(year) > 2025) onChangeYear("2025");
    if (parseInt(day) < 1) onChangeDay("1");
    if (parseInt(month) < 1) onChangeMonth("1");
    if (parseInt(year) < 1) onChangeYear("1");
  };

  const resetValues = () => {
    // Reset your state values here
    onChangeDay("");
    onChangeMonth("");
    onChangeYear("");
    onChangeLocation("");
    onChangeLevel("");
    onChangeTime("");
    onChangeHeight("");
  };

  const submitted = () => {
    Alert.alert(
      "Submitted",
      `You have submitted the following details:\nDate: ${day}/${month}/${year}\nLocation: ${location}\nLevel: ${level}\n Time: ${time}\n Height Reached: ${height}`,
      [{ text: "OK", onPress: () => resetValues() }],
    );
  };

  const { data } = useQuery<{ data: Climb[] }>("/log/fetch");

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          height: 150,
          padding: 0,
          marginBottom: 0,
        }}
      >
        <TouchableOpacity style={styles.button_log_page} onPress={showRecord}>
          <Text style={styles.button_text}> Record </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button_log_page} onPress={showHitory}>
          <Text style={styles.button_text}> History </Text>
        </TouchableOpacity>
      </View>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.image_record}
      />
      {show ? (
        <FlatList
          style={{}}
          data={data?.data}
          ListFooterComponent={<View style={{ width: 1, height: 150 }}></View>}
          renderItem={(d) => <ClimbComponent {...d.item} />}
        />
      ) : (
        <View style={{ padding: 5 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 25 }}>Date: </Text>
            <TextInput
              style={styles.date}
              onChangeText={onChangeDay}
              value={day}
              placeholder="dd"
              placeholderTextColor="#ddd"
              keyboardType="numeric"
              maxLength={2}
              onEndEditing={capValues}
            />
            <TextInput
              style={styles.date}
              onChangeText={onChangeMonth}
              value={month}
              placeholder="mm"
              placeholderTextColor="#ddd"
              keyboardType="numeric"
              maxLength={2}
              onEndEditing={capValues}
            />
            <TextInput
              style={styles.date}
              onChangeText={onChangeYear}
              value={year}
              placeholder="yyyy"
              placeholderTextColor="#ddd"
              keyboardType="numeric"
              maxLength={4}
              onEndEditing={capValues}
            />
          </View>
          <View style={{ flexDirection: "row", paddingTop: 20 }}>
            <Text style={{ fontSize: 25 }}>Location</Text>
            <TextInput
              onChangeText={onChangeLocation}
              value={location}
              placeholder="eg. Climbing Academy Kinning Park"
              placeholderTextColor="#ddd"
              keyboardType="default"
            />
          </View>
          <View style={{ flexDirection: "row", paddingTop: 20 }}>
            <Text style={{ fontSize: 25 }}>Level</Text>
            <TextInput
              onChangeText={onChangeLevel}
              value={level}
              placeholder="eg. Red or Expert"
              placeholderTextColor="#ddd"
              keyboardType="default"
            />
          </View>
          <View style={{ flexDirection: "row", paddingTop: 20 }}>
            <Text style={{ fontSize: 25 }}>Time(s)</Text>
            <TextInput
              onChangeText={onChangeTime}
              value={time}
              placeholder="eg. 20"
              placeholderTextColor="#ddd"
              keyboardType="numeric"
            />
          </View>
          <View style={{ flexDirection: "row", paddingTop: 20 }}>
            <Text style={{ fontSize: 25 }}>Height(m)</Text>
            <TextInput
              onChangeText={onChangeHeight}
              value={height}
              placeholder="eg. 5"
              placeholderTextColor="#ddd"
              keyboardType="numeric"
            />
          </View>
          <View style={{ width: 100, paddingTop: 20 }}>
            <TouchableOpacity
              style={styles.button_log_submission}
              onPress={submitted}
            >
              <Text style={styles.button_text}> Submit </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
