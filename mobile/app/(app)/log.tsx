import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  EventSubscription,
} from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { styles } from "@/constants/style";
import { useQuery } from "../../hooks/useQuery";
import { Link } from "expo-router";
import { Barometer, DeviceMotion } from "expo-sensors";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";
import { Checkbox } from "expo-checkbox";
import { useMutation } from "@/hooks/useMutation";
import Wrapper from "@/components/Wrapper";

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
  date: Date;
};

export type logResponse = {
  success?: boolean;
  message?: string;
};

export default function Log() {
  // these are the usestates used for date
  const [day, onChangeDay] = React.useState("");
  const [month, onChangeMonth] = React.useState("");
  const [year, onChangeYear] = React.useState("");

  //this is where the location is stored
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );

  //this is where the level of the climb is stored
  const [level, onChangeLevel] = React.useState("");

  //these are used for the timer and where the time is stored
  const [time, onChangeTime] = React.useState(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

  //these are the states used in measuring the chang in height of the person when climbing
  const [height, onChangeHeight] = React.useState("");
  const [initialPressure, setInitialPressure] = React.useState(0);
  const [highestPressure, setHighestPressure] = React.useState(0);
  const p_g = 1200.5; //this is the value to divide the change in pressure by tho get the height climbed
  const [subscription, setSubscription] = useState<EventSubscription | null>(
    null,
  );

  //this is the state used to toggle wether or not the phone is using the sensors to record the user
  const [recording, setRecording] = useState(false);

  //this is used for the max angles
  const [maxAngles, setMaxAngles] = useState({ maxPitch: 0, maxRoll: 0 });
  const [motionSubscription, setMotionSubscription] =
    useState<EventSubscription | null>(null);

  const [completed, toggleComplete] = useState(false);

  const [climb, setClimb] = useState<string | null>(null);

  //puts caps on day, month, year so they cant put innacurate dates
  const capValues = () => {
    if (parseInt(day) > 31) onChangeDay("31");
    if (parseInt(month) > 12) onChangeMonth("12");
    if (parseInt(year) > 2025) onChangeYear("2025");
    if (parseInt(day) < 1) onChangeDay("1");
    if (parseInt(month) < 1) onChangeMonth("1");
    if (parseInt(year) < 1) onChangeYear("1");
  };

  //resets all values to 0 when the climb is submitted
  const resetValues = () => {
    // Reset your state values here
    onChangeDay("");
    onChangeMonth("");
    onChangeYear("");
    onChangeLevel("");
    onChangeTime(0);
    onChangeHeight("");
    setHighestPressure(0);
    setInitialPressure(0);
    setMaxAngles({ maxPitch: 0, maxRoll: 0 });
    toggleComplete(false);
    setClimb(null);
  };

  //toggles between recording and not recording the values
  const toggleRecording = () => {
    if (recording) {
      stopRecording(); // Stop recording if it's currently active
      stopDeviceMotionTracking();
    } else {
      startRecording(); // Start recording if it's currently inactive
      startDeviceMotionTracking();
    }
    setRecording(!recording); // Toggle the recording state
  };

  //starts recording the presure of the persons location
  const startRecording = () => {
    // Remove any existing listener before adding a new one
    if (subscription) {
      subscription.remove(); // Remove the old subscription
      setSubscription(null); // Clear the previous subscription state
    }
    let hasSetInitialPressure = false;

    // Add a new Barometer listener
    const sub = Barometer.addListener(({ pressure }) => {
      // Set the initial pressure only once, when it is still zero
      if (!hasSetInitialPressure) {
        setInitialPressure(pressure);
        hasSetInitialPressure = true; // Mark initial pressure as set
      }

      // Track the lowest pressure (highest point)
      setHighestPressure((prevHighest) => {
        if (pressure !== 0 && (prevHighest === 0 || pressure < prevHighest)) {
          // console.log("Highest Pressure Updated:", pressure);
          return pressure;
        }
        return prevHighest; // If no update is needed, return the current highest
      });
    });

    setSubscription(sub as unknown as EventSubscription); // Store the subscription

    const interval = setInterval(() => {
      onChangeTime((prevTime) => {
        const numericTime = prevTime === 0 ? 0 : prevTime;
        return numericTime + 1;
      });
    }, 1000);

    setTimerInterval(interval as unknown as number); // Save the interval ID to state
  };

  //stops recording the pressure at the persons location
  const stopRecording = () => {
    // Remove Barometer listener
    if (subscription) {
      subscription.remove(); // Stop the updates
      setSubscription(null); // Clear the subscription state
      // console.log("Barometer listener stopped.");
    }

    if (timerInterval) {
      clearInterval(timerInterval); // Clear the interval
      setTimerInterval(null); // Reset the interval state
    }
  };

  const try_submit = () => {
    if (!(climb === null)) {
      if (!(level === null)) {
        if (!(location === null)) {
          if (!(height === null)) {
            submitted();
          } else {
            Alert.alert("Missing height. Please submit a height and try again");
          }
        } else {
          Alert.alert("Missing location. Please turn on location services");
        }
      } else {
        Alert.alert("Missing level. Please submit a level and try again");
      }
    } else {
      Alert.alert("Missing type. Please submit a type and try again");
    }
  };

  //submits the record for and will put it in the database
  const [sendRequest, { data: response }] =
    useMutation<logResponse>("/log/add");

  const submitted = () => {
    let new_day = Number(day);
    let new_month = Number(month);
    let new_year = Number(year);
    const proper_date = `${new_day < 10 ? "0" + new_day : String(new_day)}/${new_month < 10 ? "0" + new_month : new_month}/${new_year % 1000}`;
    Alert.alert(
      "Submitted",
      `You have submitted the following details:\nDate: ${day}/${month}/${year}\nLocation: ${location}\nLevel: ${level}\nTime: ${time}\nHeight Reached: ${height}`,
      [{ text: "OK", onPress: () => resetValues() }],
    );
    sendRequest({
      type: climb,
      time_s: time,
      level: level,
      success: completed,
      angle: maxAngles,
      lat: location?.coords.latitude,
      lon: location?.coords.longitude,
      height: height,
      date: proper_date,
    });
    if (response?.message) {
      Alert.alert(response.message);
    }
  };

  //this calculates the height based on the formula (p1 - p2)/ (pressure at ground level * gravity) -- all converted to pascals
  useEffect(() => {
    if (initialPressure !== 0 && highestPressure !== 0) {
      const height = (initialPressure * 100 - highestPressure * 100) / p_g;
      onChangeHeight(height.toFixed(2)); // Update the height state
      // console.log("Height Calculated:", height.toFixed(2));
    }
  }, [initialPressure, highestPressure]);

  //this is where the extreme angle is calculated and stored in the max angle state
  const startDeviceMotionTracking = () => {
    const sub = DeviceMotion.addListener((motionData) => {
      if (motionData && motionData.acceleration) {
        const { x, y, z } = motionData.acceleration;

        // Calculate pitch and roll
        const pitch = Math.atan2(x, Math.sqrt(y * y + z * z)) * (180 / Math.PI);
        const roll = Math.atan2(y, Math.sqrt(x * x + z * z)) * (180 / Math.PI);

        // Update max pitch and roll
        setMaxAngles((prev) => ({
          maxPitch: Math.max(prev.maxPitch, Math.abs(pitch)),
          maxRoll: Math.max(prev.maxRoll, Math.abs(roll)),
        }));
      }
    });
    setMotionSubscription(sub as unknown as EventSubscription);
  };

  //this stops the angle recording so it doesnt eat battery when not recording
  const stopDeviceMotionTracking = () => {
    if (motionSubscription) {
      motionSubscription.remove();
      setMotionSubscription(null);
      // console.log("DeviceMotion listener stopped.");
    }
  };

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Error", "Failed to access deviece location");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }
    getCurrentLocation();
  }, []);

  return (
    <Wrapper>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.image_record}
      />
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
          <Text style={{ fontSize: 25 }}>Current Location:</Text>
          {location ? (
            <Text style={{ fontSize: 15 }}>
              {location.coords.latitude} {"\n"}
              {location.coords.longitude}
            </Text>
          ) : (
            <Text style={{ fontSize: 15 }}>Fetching {"\n"}location...</Text>
          )}
        </View>
        <View style={{ flexDirection: "row", paddingTop: 20 }}>
          <Text style={{ fontSize: 25 }}>Time(s)</Text>
          <TextInput
            onChangeText={(text) => onChangeTime(parseInt(text) || 0)}
            value={time.toString()}
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
        <View style={{ flexDirection: "row", paddingTop: 20 }}>
          <Text style={{ fontSize: 25 }}>Level</Text>
          <Picker
            selectedValue={level}
            onValueChange={onChangeLevel}
            style={styles.picker}
          >
            <Picker.Item label="Easy" value="red" />
            <Picker.Item label="Medium" value="medium" />
            <Picker.Item label="Hard" value="hard" />
            <Picker.Item label="Expert" value="expert" />
          </Picker>
        </View>
        <View style={{ flexDirection: "row", paddingTop: 20 }}>
          <Text style={{ fontSize: 25 }}>Type of Climb</Text>
          <Picker
            selectedValue={climb}
            onValueChange={setClimb}
            style={styles.picker}
          >
            <Picker.Item label="Overhang" value="overhang" />
            <Picker.Item label="Jug" value="jug" />
            <Picker.Item label="Crimp" value="crimp" />
            <Picker.Item label="Scramble" value="scramble" />
            <Picker.Item label="Outdoor" value="outdoor" />
            <Picker.Item label="Slopers" value="slopers" />
            <Picker.Item label="Pocket" value="pocket" />
            <Picker.Item label="Slab" value="slab" />
            <Picker.Item label="Footholds" value="footholds" />
            <Picker.Item label="Vertical" value="vertical" />
            <Picker.Item label="Roof" value="roof" />
            <Picker.Item label="Mantle" value="mantle" />
          </Picker>
        </View>
        <View style={{ flexDirection: "row", paddingTop: 20 }}>
          <Text style={{ fontSize: 25 }}>Extreme Angles (°)</Text>
          <TextInput
            onChangeText={(text) =>
              setMaxAngles((prev) => ({
                ...prev, // Spread the previous state to keep existing values
                maxPitch: parseInt(text) || 0, // Update only the specific property
              }))
            }
            value={maxAngles.maxPitch.toString()} // Access the maxPitch property from the state
            placeholder="eg. 13°"
            placeholderTextColor="#ddd"
            keyboardType="numeric"
          />
        </View>
        <View style={{ flexDirection: "row", paddingTop: 20 }}>
          <Text style={{ fontSize: 25 }}>Climb Completed </Text>
          <Checkbox value={completed} onValueChange={toggleComplete} />
        </View>
        <View
          style={{
            width: 100,
            paddingTop: 20,
            paddingRight: 10,
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={styles.button_log_submission}
            onPress={try_submit}
          >
            <Text style={styles.button_text}> Submit </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button_log_submission}
            onPress={toggleRecording}
          >
            <Text style={styles.button_text}>
              {recording ? "Stop" : "Start"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Wrapper>
  );
}
