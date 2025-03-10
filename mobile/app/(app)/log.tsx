import { useState } from "react";
import {View, Text, Button, Alert } from "react-native";
import React from "react";
import { TextInput } from "react-native-gesture-handler";

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

  const showNames = () => {
    setShow(true);
  };

  const hideNames = () => {
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
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <Button
            onPress={hideNames}
            title="Record"
            color="black"
            accessibilityLabel="Record your scores manually or with inbuilt technology"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            onPress={showNames}
            title="History"
            color="black"
            accessibilityLabel="Show your history of past recorded climbs"
          />
        </View>



      </View>

      {show ? (
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
        ):
        <View style= {{padding: 10}}>
          <View style = {{flexDirection: "row", paddingTop: 20}}>
            <Text style = {{fontSize: 25}}>Date: </Text>
            <TextInput
              onChangeText={onChangeDay}
              value = {day}
              placeholder="dd"
              placeholderTextColor="#ddd"
              keyboardType='numeric'
              maxLength={2}
              onEndEditing={capValues}
            />
            <TextInput
              onChangeText={onChangeMonth}
              value = {month}
              placeholder="mm"
              placeholderTextColor="#ddd"
              keyboardType='numeric'
              maxLength={2}
              onEndEditing={capValues}
            />
            <TextInput
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
            <Button
              onPress= {submitted}
              title="submit"
              color = "black"
              accessibilityLabel="this is where you submit your climb"
            />
          </View>
        </View>
        }
    </View>
  );
}
