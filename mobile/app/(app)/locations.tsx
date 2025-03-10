import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import MapView, { Region, Marker, Callout } from "react-native-maps";
import { styles } from "../../constants/style";
import * as Location from "expo-location";
import { Link } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

function setDefaultLocation() {
  //can perform data base read for this later but ill hard code it for now
  return {
    latitude: 55.83335013765077,
    latitudeDelta: 0.32373518987527206,
    longitude: -4.254001719804215,
    longitudeDelta: 0.29464614388276633,
  };
}

type Spot = {
  latitude: number;
  longitude: number;
  name: string;
  desc: string;
  id: number;
};

const DefaultPoints: Spot[] = [
  {
    latitude: 55.8506,
    longitude: -4.3138,
    name: "The Newsroom - The Climbing Academy",
    desc: "A large, welcoming bouldering centre close to Glasgow's centre, featuring a kids' climbing area, endurance circuits, gym equipment, and a stretching area.",
    id: 1,
  },
  {
    latitude: 55.8886,
    longitude: -4.2829,
    name: "The Prop Store - The Climbing Academy",
    desc: "A contemporary climbing centre in Maryhill with bouldering walls, a small roped climbing area with auto belays, lead and top-rope facilities, a well-equipped gym, and a training wall.",
    id: 2,
  },
  {
    latitude: 55.8526,
    longitude: -4.304,
    name: "Glasgow Climbing Centre",
    desc: "One of Scotland's first dedicated indoor climbing gyms, offering lead climbing, top rope routes, auto belays, and a bouldering area, all within a unique and spacious setting.",
    id: 3,
  },
];

export default function Locations() {
  //NOTE: this is how states are managed as oppsed to page self refferencing
  // const [state, setState] = useState(0);

  //pre processing

  //state management
  //location state
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );

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

  //marker information state
  const [bottomState, setBottomState] = useState<Spot | null>(null);

  // const handleMarkerPress = () => {
  //   markerRef
  //   setBottomView(!showBottomView)
  //
  // }

  //actual app render
  return (
    <View style={styles.map_container}>
      <MapView style={styles.map} initialRegion={setDefaultLocation()}>
        {location !== null ? (
          <Marker
            key="user"
            coordinate={location.coords}
            pinColor="red"
            onPress={() => {
              setBottomState(null);
            }}
          />
        ) : null}

        {DefaultPoints.map((point) => (
          <Marker
            key={point.name + point.id}
            coordinate={{
              latitude: point.latitude,
              longitude: point.longitude,
            }}
            pinColor="blue"
            onPress={() => {
              setBottomState(point);
            }}
          >
            <Callout tooltip={true}>
              <View
                style={{ height: 1, width: 1, backgroundColor: "transparent" }}
              />
            </Callout>
          </Marker>
        ))}
      </MapView>
      {bottomState ? (
        <View style={styles.bottomView}>
          <View
            style={{
              backgroundColor: "#fff",
              flexDirection: "row",
              padding: 10,
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            <Text style={{ fontSize: 20 }}>{bottomState.name}</Text>
            <Entypo
              name="cross"
              size={24}
              color="black"
              onPress={() => setBottomState(null)}
            />
          </View>
          <View style={{ padding: 10 }}>
            <Text>{bottomState.desc + "\n"}</Text>
            <Link
              style={{ color: "blue" }}
              href={`https://www.google.com/maps/dir/?api=1&origin=${location?.coords.latitude},${location?.coords.longitude}&destination=${bottomState.latitude},${bottomState.longitude}`}
            >
              Directions
            </Link>
          </View>
        </View>
      ) : null}
    </View>
  );
}
