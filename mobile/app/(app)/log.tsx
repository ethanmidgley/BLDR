import { useEffect, useState } from "react";
import {View, Text, Image, Alert, TouchableOpacity, EventSubscription } from "react-native";
import React from "react";
import { TextInput } from "react-native-gesture-handler";
import { styles } from "@/constants/style";
import {Barometer, DeviceMotion} from 'expo-sensors';


const dates = ["01/01/01", "02/02/02", "03/03/03"];
const names = ["jeff", "test", "name 3"];


export default function Log() {
  //this is the usestate to detirmine which page is shown
  const [show, setShow] = useState(false);

  // these are the usestates used for date
  const [day, onChangeDay] = React.useState('');
  const [month, onChangeMonth] = React.useState('');
  const [year, onChangeYear] = React.useState('');

  //this is where the location is stored
  const [location, onChangeLocation] = React.useState('');

  //this is where the level of the climb is stored
  const [level, onChangeLevel] = React.useState('');

  //these are used for the timer and where the time is stored
  const [time, onChangeTime] = React.useState(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

  //these are the states used in measuring the chang in height of the person when climbing
  const [height,onChangeHeight] = React.useState('');
  const [initialPressure, setInitialPressure] = React.useState(0);
  const [highestPressure, setHighestPressure] = React.useState(0);
  const p_g = 1200.5; //this is the value to divide the change in pressure by tho get the height climbed
  const [subscription, setSubscription] = useState<EventSubscription | null>(null);

  //this is the state used to toggle wether or not the phone is using the sensors to record the user
  const [recording, setRecording] = useState(false);

  //this is used for the max angles
  const [maxAngles, setMaxAngles] = useState({ maxPitch: 0, maxRoll: 0 });
  const [motionSubscription, setMotionSubscription] = useState<EventSubscription | null>(null);

  //triggers to the history page
  const showHitory = () => {
    setShow(true);
  };

  //triggers to the record page(which is the initial page aswell)
  const showRecord = () => {
    setShow(false)
  }

  //puts caps on day, month, year so they cant put innacurate dates
  const capValues = () => {
    if (parseInt(day) > 31) onChangeDay('31');
    if (parseInt(month) > 12) onChangeMonth('12');
    if (parseInt(year) > 2025) onChangeYear('2025');
    if (parseInt(day) < 1) onChangeDay('1');
    if (parseInt(month) < 1) onChangeMonth('1');
    if (parseInt(year) < 1) onChangeYear('1');
  };

  //resets all values to 0 when the climb is submitted
  const resetValues = () => {
    // Reset your state values here
    onChangeDay('');
    onChangeMonth('');
    onChangeYear('');
    onChangeLocation('');
    onChangeLevel('');
    onChangeTime(0);
    onChangeHeight('');
    setHighestPressure(0);
    setInitialPressure(0);
    setMaxAngles({ maxPitch: 0, maxRoll: 0 })
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
          console.log("Highest Pressure Updated:", pressure);
          return pressure;
        }
        return prevHighest; // If no update is needed, return the current highest

      });

      
    });
  
    setSubscription(sub as unknown as EventSubscription); // Store the subscription

    const interval = setInterval(() => {
      onChangeTime((prevTime) => {
        const numericTime = prevTime === 0 ? 0 : prevTime;
        return (numericTime + 1);
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
      console.log("Barometer listener stopped.");
    }
  
    if (timerInterval) {
      clearInterval(timerInterval); // Clear the interval
      setTimerInterval(null); // Reset the interval state
    }
  };

  //submits the record for and will put it in the database
  const submitted = () => {
    Alert.alert(
      'Submitted', 
      `You have submitted the following details:\nDate: ${day}/${month}/${year}\nLocation: ${location}\nLevel: ${level}\nTime: ${time}\nHeight Reached: ${height}`,
      [
        { text: 'OK', onPress: () => resetValues() },
      ]
    );
  };

  //this calculates the height based on the formula (p1 - p2)/ (pressure at ground level * gravity) -- all converted to pascals
  useEffect(() => {
    if (initialPressure !== 0 && highestPressure !== 0) {
      const height = ((initialPressure * 100) - (highestPressure*100)) / p_g;
      onChangeHeight(height.toFixed(2)); // Update the height state
      console.log("Height Calculated:", height.toFixed(2));
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
  }
 
  //this stops the angle recording so it doesnt eat battery when not recording
  const stopDeviceMotionTracking = () => {
    if (motionSubscription) {
      motionSubscription.remove();
      setMotionSubscription(null);
      console.log("DeviceMotion listener stopped.");
    }
  };

  return (
    
    <View>
      <View style={{ flexDirection: "row", height: 150, padding:0, marginBottom:0}}>
        <TouchableOpacity style = {styles.button_log_page} onPress = {showRecord}>
          <Text style = {styles.button_text}> Record </Text>
        </TouchableOpacity>
        <TouchableOpacity style = {styles.button_log_page} onPress = {showHitory}>
          <Text style = {styles.button_text}> History </Text>
        </TouchableOpacity>
      </View>
      <Image source = {require("../../assets/images/logo.png")} style = {styles.image_record} />
      {show ? (
      <View>
        {names.map((name, index) => (
        <View key={index} style = {styles.history_container}>
        <Text style = {{fontSize: 25}}>
            {name} - {dates[index]}
          </Text>
          <Text style = {{fontSize: 25}}>Time: </Text>
          <Text style ={{fontSize: 25}}>
            Height: 
          </Text>
          </View>
          ))}
          </View>
        ):
        
        <View style= {{padding: 5}}>
          <View style = {{flexDirection: "row"}}>
            <Text style = {{fontSize: 25}}>Date: </Text>
            <TextInput
              style = {styles.date}
              onChangeText={onChangeDay}
              value = {day}
              placeholder="dd"
              placeholderTextColor="#ddd"
              keyboardType='numeric'
              maxLength={2}
              onEndEditing={capValues}
            />
            <TextInput
              style = {styles.date}
              onChangeText={onChangeMonth}
              value = {month}
              placeholder="mm"
              placeholderTextColor="#ddd"
              keyboardType='numeric'
              maxLength={2}
              onEndEditing={capValues}
            />
            <TextInput
              style = {styles.date}
              onChangeText={onChangeYear}
              value = {year}
              placeholder="yyyy"
              placeholderTextColor="#ddd"
              keyboardType='numeric'
              maxLength={4}
              onEndEditing={capValues}
            />
            </View>
            <View style = {{flexDirection:'row', paddingTop: 20}}>
              <Text style = {{fontSize: 25}}>Location</Text>
              <TextInput  
                onChangeText={onChangeLocation}
                value = {location}
                placeholder="eg. Climbing Academy Kinning Park"
                placeholderTextColor="#ddd"
                keyboardType="default"
              />
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 20}}>
              <Text style={{ fontSize: 25 }}>Level</Text>
              <TextInput
                onChangeText={onChangeLevel}
                value = {level}
                placeholder="eg. Red or Expert"
                placeholderTextColor="#ddd"
                keyboardType='default'
                />
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 20}}>
              <Text style={{ fontSize: 25 }}>Time(s)</Text>
              <TextInput
                onChangeText={(text) => onChangeTime(parseInt(text) || 0)}
                value = {time.toString()}
                placeholder="eg. 20"
                placeholderTextColor="#ddd"
                keyboardType='numeric'
              />
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 20}}>
              <Text style={{ fontSize: 25 }}>Height(m)</Text>
              <TextInput
                onChangeText={onChangeHeight}
                value={height}
                placeholder="eg. 5"
                placeholderTextColor="#ddd"
                keyboardType='numeric'
              />
            </View>
            <View style = {{ flexDirection: 'row', paddingTop: 20}}>
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
            {/* <Text>{currentPressure}</Text>
            <Text>{highestPressure}</Text>
            <Text>{initialPressure}</Text> */}
          <View style= {{width: 100, paddingTop: 20, paddingRight: 10, flexDirection: 'row'}}>
          <TouchableOpacity style = {styles.button_log_submission} onPress = {submitted}>
            <Text style = {styles.button_text}> Submit </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button_log_submission} onPress={toggleRecording}>
            <Text style={styles.button_text}>
              {recording ? "Stop" : "Start"} 
            </Text>
          </TouchableOpacity>
          </View>
        </View>
        }
    </View>
  );
}
