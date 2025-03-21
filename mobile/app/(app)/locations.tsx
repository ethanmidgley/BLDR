import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import MapView, { Region, Marker, Callout } from "react-native-maps";
import { styles } from "../../constants/style";
import * as Location from "expo-location";
import { Link } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import {
  PostComponent,
  Climb,
  Post,
  Comment,
  commentResponse,
} from "@/components/PostComponent";
import { useQuery } from "@/hooks/useQuery";

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
    latitude: 55.85065133261212,
    longitude: -4.281816013493083,
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

const boulderingGrades: string[] = [
  "#A8E6CF", // V0 (Soft Green)
  "#FFD97D", // V1 (Warm Yellow)
  "#FFAB6C", // V2 (Light Orange)
  "#FF6B6B", // V3 (Bright Red)
  "#BE4BDB", // V4 (Vibrant Purple)
  "#5A77FF", // V5 (Deep Blue)
  "#6E44FF", // V6 (Dark Violet)
  "#543864", // V7 (Muted Dark Purple)
  "#3B2F51", // V8 (Deep Gray-Purple)
  "#2A1F38", // V9 (Almost Black)
  "#1A131F", // V10+ (Near Black)
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
        Alert.alert("Error", "Failed to access device location");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }
    getCurrentLocation();
  }, []);

  //marker information state
  const [bottomStateSpot, setBottomStateSpot] = useState<Spot | null>(null);
  const [bottomStatePost, setBottomStatePost] = useState<Post | null>(null);

  // const handleMarkerPress = () => {
  //   markerRef
  //   setBottomView(!showBottomView)
  //
  // }
  //

  //fetch posts to grab climbs
  const { data } = useQuery<Post[]>("/posts/fetch");
  console.log(data);

  //actual app render
  return (
    <View style={styles.map_container}>
      <MapView style={styles.map} initialRegion={setDefaultLocation()}>
        {/*render user location*/}
        {location !== null ? (
          <Marker
            key="user"
            coordinate={location.coords}
            pinColor="red"
            onPress={() => {
              setBottomStateSpot(null);
              setBottomStatePost(null);
            }}
          />
        ) : null}
        {/*render default location*/}
        {DefaultPoints.map((point) => (
          <Marker
            key={point.name + point.id}
            coordinate={{
              latitude: point.latitude,
              longitude: point.longitude,
            }}
            pinColor="blue"
            onPress={() => {
              setBottomStatePost(null);
              setBottomStateSpot(point);
            }}
          >
            <Callout tooltip={true}>
              <View
                style={{ height: 1, width: 1, backgroundColor: "transparent" }}
              />
            </Callout>
          </Marker>
        ))}
        {/*render other user posts location*/}
        {data?.map((post) => (
          <Marker
            key={post.title + post.id}
            coordinate={{
              latitude: post.climb.lat,
              longitude: post.climb.lon,
            }}
            pinColor={
              post.climb.level >= 10
                ? boulderingGrades[10]
                : boulderingGrades[Math.floor(post.climb.level)]
            }
            onPress={() => {
              setBottomStateSpot(null);
              setBottomStatePost(post);
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
      {/*two states may be null but they won't be active at the same time*/}
      {bottomStateSpot ? (
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
            <Text style={{ fontSize: 20 }}>{bottomStateSpot.name}</Text>
            <Entypo
              name="cross"
              size={24}
              color="black"
              onPress={() => setBottomStateSpot(null)}
            />
          </View>
          <View style={{ padding: 10 }}>
            <Text>{bottomStateSpot.desc + "\n"}</Text>
            <Link
              style={{ color: "blue" }}
              href={`https://www.google.com/maps/dir/?api=1&origin=${location?.coords.latitude},${location?.coords.longitude}&destination=${bottomStateSpot.latitude},${bottomStateSpot.longitude}`}
            >
              Directions
            </Link>
          </View>
        </View>
      ) : bottomStatePost ? (
        <View style={{ ...styles.bottomView, height: "60%" }}>
          <View
            style={{
              backgroundColor: "#fff",
              flexDirection: "row",
              padding: 10,
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 800 }}>
              Nº:{bottomStatePost.climb.lat}, Eº:{bottomStatePost.climb.lon}
            </Text>
            <Entypo
              name="cross"
              size={24}
              color="black"
              onPress={() => setBottomStatePost(null)}
            />
          </View>
          <ScrollView>
            <PostComponent {...bottomStatePost} />
            <View style={{ height: 100, width: 1 }}></View>
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}
