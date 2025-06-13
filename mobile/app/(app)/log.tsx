import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  EventSubscription,
  Vibration,
} from "react-native";
import { FlatList, ScrollView, TextInput } from "react-native-gesture-handler";
import { Dropdown } from "react-native-element-dropdown";
import { styles } from "@/constants/style";
import { useQuery } from "../../hooks/useQuery";
import { Link } from "expo-router";
import { Barometer, DeviceMotion, Gyroscope } from "expo-sensors";
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

const dropDownData = [
  { label: "Overhang", value: "Overhang" },
  { label: "Jug", value: "Jug" },
  { label: "Crimp", value: "Crimp" },
  { label: "Scramble", value: "Scramble" },
  { label: "Slopers", value: "Slopers" },
  { label: "Pocket", value: "Pocket" },
  { label: "Slab", value: "Slab" },
  { label: "Footholds", value: "Footholds" },
  { label: "Vertical", value: "Vertical" },
  { label: "Roof", value: "Roof" },
  { label: "Mantle", value: "Mantle" },
  { label: "Outdoor", value: "Outdoor" },
  { label: "Jamming", value: "Jamming" },
];

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
  const [level, onChangeLevel] = React.useState(0);

  //these are used for the timer and where the time is stored
  const [time, onChangeTime] = React.useState(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

  //these are the states used in measuring the chang in height of the person when climbing
  const [height, onChangeHeight] = React.useState(0);
  const [initialPressure, setInitialPressure] = React.useState(0);
  const [highestPressure, setHighestPressure] = React.useState(0);
  const p_g = 120.5; //this is the value to divide the change in pressure by tho get the height climbed
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
  const [climbType, setClimbType] = useState<string | null>(null);

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
    onChangeLevel(0);
    onChangeTime(0);
    onChangeHeight(0);
    setHighestPressure(0);
    setInitialPressure(0);
    setMaxAngles({ maxPitch: 0, maxRoll: 0 });
    toggleComplete(false);
    setClimbType(null);
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
    }

    if (timerInterval) {
      clearInterval(timerInterval); // Clear the interval
      setTimerInterval(null); // Reset the interval state
    }

    //data and time variables
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const month_str = month < 10 ? "0" + month.toString() : month.toString();
    const day_str = day < 10 ? "0" + day.toString() : day.toString();

    onChangeDay(day_str);
    onChangeMonth(month_str);
    onChangeYear(year);
  };

  //TODO: add better validation to this
  const try_submit = () => {
    if (!(climbType === null)) {
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
    const proper_date = `${new_year % 1000}/${new_month < 10 ? "0" + new_month : new_month}/${new_day < 10 ? "0" + new_day : String(new_day)}`;
    Alert.alert(
      "Submitted",
      `You have submitted the following details:\nDate: ${day}/${month}/${year}\nLevel: ${level}\nTime: ${time}\nHeight Reached: ${height}\n Type of Climb: ${climbType}\nExtreme Angle: ${maxAngles.maxPitch}`,
      [{ text: "OK", onPress: () => resetValues() }],
    );
    sendRequest({
      type: climbType,
      time: time,
      level: level,
      success: completed,
      angle: maxAngles.maxPitch,
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
      const height = (initialPressure * 100 - highestPressure *100 ) / p_g;
      onChangeHeight(parseFloat(height.toFixed(2))); // Update the height state
      // console.log("Height Calculated:", height.toFixed(2));
    }
  }, [initialPressure, highestPressure]);

  //this is where the extreme angle is calculated and stored in the max angle state
  const startDeviceMotionTracking = () => {
    const sub = Gyroscope.addListener((gyroData) => {
      const { x, y, z } = gyroData;
      const pitch = Math.atan2(y, Math.sqrt(x * x + y * y)) * (180 / Math.PI);
      const roll = Math.atan2(x, Math.sqrt(y * y + z * z)) * (180 / Math.PI);

      // Update max pitch and roll
      setMaxAngles((prev) => ({
        maxPitch: Math.max(prev.maxPitch, Math.abs(pitch)),
        maxRoll: Math.max(prev.maxRoll, Math.abs(roll)),
      }));
    });

    Gyroscope.setUpdateInterval(100);
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

  //this is where the app gets the location of the user when the app is opened
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
      <ScrollView>
       <Text style={{ ...styles.headingMedium, paddingVertical: 15 }}>
          Logged Climb Values
        </Text>
        <View style={{ padding: 5, paddingVertical: 20 }}>
          {/*Date view*/}
          <View style={styles.climb_info_spacing}>
            <Text style={styles.headingSmall}>Date: </Text>
            <TextInput
              style={styles.date}
              onChangeText={onChangeDay}
              returnKeyType="done"
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
              returnKeyType="done"
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
              returnKeyType="done"
              value={year}
              placeholder="yyyy"
              placeholderTextColor="#ddd"
              keyboardType="numeric"
              maxLength={4}
              onEndEditing={capValues}
            />
          </View>
          {/*User Location view*/}
          <View style={styles.climb_info_spacing}>
            <Text style={styles.headingSmall}>Location:</Text>
            {location ? (
              <Text style={styles.headingSmall}>
                {location.coords.latitude.toFixed(5)}
                {"\n"}
                {location.coords.longitude.toFixed(5)}
              </Text>
            ) : (
              <Text style={styles.headingSmall}>
                Fetching {"\n"}location...
              </Text>
            )}
          </View>
          {/*TIMER VIEW*/}
          <View style={styles.climb_info_spacing}>
            <Text style={styles.headingSmall}>Time (s)</Text>
            <TextInput
              onChangeText={(text) => onChangeTime(parseInt(text) || 0)}
              value={time.toString()}
              returnKeyType="done"
              placeholder="eg. 20"
              placeholderTextColor="#ddd"
              keyboardType="numeric"
            />
          </View>
          {/*Height recording*/}
          <View style={styles.climb_info_spacing}>
            <Text style={{ ...styles.headingSmall, paddingRight: 15 }}>
              Height (m)
            </Text>
            <TextInput
              onChangeText={(text) => onChangeHeight(parseInt(text) || 0)}
              value={height.toString()}
              returnKeyType="done"
              placeholder="eg. 5"
              placeholderTextColor="#ddd"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.climb_info_spacing}>
            <Text style={{ ...styles.headingSmall, paddingRight: 20 }}>
              Level
            </Text>
            <TextInput
              // need to make this shit regulate the input to 1dp, could just validate on submit for now
              value={level.toString()}
              placeholder="eg. 3.4, 10, 7.0"
              placeholderTextColor="#ddd"
              keyboardType="numeric"
              returnKeyType="done"
              onChangeText={(text) => onChangeLevel(parseInt(text) || 0)}
              onEndEditing={(event) => {
                const num = parseFloat(event.nativeEvent.text) || 0;
                if (num === Math.floor(num)) {
                  //parse only the integer if there are no decimal points following
                  onChangeLevel(num);
                } else {
                  onChangeLevel(num);
                }
              }}
            />
          </View>
          {/*DROPDOWN*/}
          <View style={styles.climb_info_spacing}>
            <Text style={{ ...styles.headingSmall, paddingRight: 20 }}>
              Type
            </Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={dropDownData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select an option"
              searchPlaceholder="Search..."
              value={climbType}
              onChange={(item: {
                value: React.SetStateAction<string | null>;
              }) => {
                setClimbType(item.value);
              }}
            />
          </View>
          {/*ANGLE SELECTOR*/}
          <View style={styles.climb_info_spacing}>
            <Text style={styles.headingSmall}>Extreme Angles (°)</Text>
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
          {/*climb complete checkbox*/}
          <View style={styles.climb_info_spacing}>
            <Text style={styles.headingSmall}>Climb Completed </Text>
            <Checkbox value={completed} onValueChange={toggleComplete} />
          </View>
          <View
            style={{
              ...styles.climb_info_spacing,
              width: "100%",
              height: "50%",
              columnGap: 20,
            }}
          >
            {/* this is where the buttons are positioned */}
            <View style={styles.button_positioning}>
              <TouchableOpacity
                style={styles.button_log_submission}
                onPress={resetValues}
              >
                <Text style={styles.button_text}> Reset </Text>
              </TouchableOpacity>
            </View>
            {/* <View style={{ paddingHorizontal: 15 }} /> */}
            <View style={styles.button_positioning}>
              <TouchableOpacity
                style={
                  recording
                    ? styles.button_log_submission
                    : {
                        //#228B22 -> forrest green
                        ...styles.button_log_submission,
                        backgroundColor: "#228B22",
                      }
                }
                onPress={toggleRecording}
              >
                <Text
                  style={styles.button_text}
                  onPress={() => {
                    toggleRecording();
                    Vibration.vibrate(100);
                  }}
                >
                  {recording ? "Stop" : "Start"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button_positioning}>
              <TouchableOpacity
                style={styles.button_log_submission}
                onPress={try_submit}
              >
                <Text style={styles.button_text}> Submit </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </Wrapper>
  );
}
