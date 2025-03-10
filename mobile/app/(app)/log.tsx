import { useState } from "react";
import {View, Text, Image, Alert, TouchableOpacity } from "react-native";
import React from "react";
import { TextInput } from "react-native-gesture-handler";
import { styles } from "@/constants/style";


const dates = ["01/01/01", "02/02/02", "03/03/03"];
const names = ["jeff", "test", "name 3"];

export default function Log() {
  const [show, setShow] = useState(false);
  const [day, onChangeDay] = React.useState('');
  const [month, onChangeMonth] = React.useState('');
  const [year, onChangeYear] = React.useState('');
  const [location, onChangeLocation] = React.useState('');
  const [level, onChangeLevel] = React.useState('');
  const [time, onChangeTime] = React.useState('');
  const [height,onChangeHeight] = React.useState('');

  const showHitory = () => {
    setShow(true);
  };

  const showRecord = () => {
    setShow(false)
  }

  const capValues = () => {
    if (parseInt(day) > 31) onChangeDay('31');
    if (parseInt(month) > 12) onChangeMonth('12');
    if (parseInt(year) > 2025) onChangeYear('2025');
    if (parseInt(day) < 1) onChangeDay('1');
    if (parseInt(month) < 1) onChangeMonth('1');
    if (parseInt(year) < 1) onChangeYear('1');
  };

  const resetValues = () => {
    // Reset your state values here
    onChangeDay('');
    onChangeMonth('');
    onChangeYear('');
    onChangeLocation('');
    onChangeLevel('');
    onChangeTime('');
    onChangeHeight('');
  };

  const submitted = () =>{
    Alert.alert('Submitted', 
      `You have submitted the following details:\nDate: ${day}/${month}/${year}\nLocation: ${location}\nLevel: ${level}\n Time: ${time}\n Height Reached: ${height}`,
       [
      {text: 'OK', onPress: () => resetValues()},
    ]);
  }

  return (
    <View>
      <View style={{ flexDirection: "row", height: 150 }}>
        <TouchableOpacity style = {styles.button_log_page} onPress = {showRecord}>
          <Text style = {styles.button_text}> Record </Text>
        </TouchableOpacity>
        <TouchableOpacity style = {styles.button_log_page} onPress = {showHitory}>
          <Text style = {styles.button_text}> History </Text>
        </TouchableOpacity>
      </View>

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
        
        <View style= {{padding: 10}}>
          {/* <Image source = {require("../assets/images/icon.png")} style = {styles.image} /> */}
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
                onChangeText={onChangeTime}
                value = {time}
                placeholder="eg. 20"
                placeholderTextColor="#ddd"
                keyboardType='numeric'
              />
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 20}}>
              <Text style={{ fontSize: 25 }}>Height(m)</Text>
              <TextInput
                onChangeText={onChangeHeight}
                value = {height}
                placeholder="eg. 5"
                placeholderTextColor="#ddd"
                keyboardType='numeric'
              />
            </View>
          <View style= {{width: 100, paddingTop: 20}}>
          <TouchableOpacity style = {styles.button_log_submission} onPress = {submitted}>
            <Text style = {styles.button_text}> Submit </Text>
          </TouchableOpacity>
          </View>
        </View>
        }
    </View>
  );
}
