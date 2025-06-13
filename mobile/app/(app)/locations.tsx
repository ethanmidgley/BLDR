import React, { useEffect, useState } from "react";
import { View, Text, Alert, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import MapView, {
  Marker,
  Callout,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from "react-native-maps";
import { styles } from "../../constants/style";
import * as Location from "expo-location";
import { Link } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { PostComponent, Post } from "@/components/PostComponent";
import { useQuery } from "@/hooks/useQuery";
import { useSession } from "@/context/context";

function setDefaultLocation() {
  //can perform data base read for this later but ill hard code it for now
  return {
    latitude: 55.83335013765077,
    latitudeDelta: 0.32373518987527206,
    longitude: -4.254001719804215,
    longitudeDelta: 0.29464614388276633,
  };
}

const spot_images = {
  newsroom: require("../../assets/images/locales/the-newsroom.jpg"),
  prop_store: require("../../assets/images/locales/the-prop-store.jpg"),
  glasgow_climbing_centre: require("../../assets/images/locales/glasgow-climbing-centre.jpg"),
  cuningar: require("../../assets/images/locales/cuningar.jpg"),
  climbzone: require("../../assets/images/locales/climbzone.jpg"),
};

type spot_image_key = keyof typeof spot_images;

type Spot = {
  latitude: number;
  longitude: number;
  image: spot_image_key;
  name: string;
  desc: string;
  id: number;
};

const DefaultPoints: Spot[] = [
  {
    latitude: 55.85065133261212,
    longitude: -4.281816013493083,
    image: "newsroom",
    name: "The Newsroom - The Climbing Academy",
    desc: "A large, welcoming bouldering centre close to Glasgow's centre, featuring a kids' climbing area, endurance circuits, gym equipment, and a stretching area.",
    id: 1,
  },
  {
    latitude: 55.89055716863573,
    longitude: -4.2864546895367255,
    image: "prop_store",
    name: "The Prop Store - The Climbing Academy",
    desc: "A contemporary climbing centre in Maryhill with bouldering walls, a small roped climbing area with auto belays, lead and top-rope facilities, a well-equipped gym, and a training wall.",
    id: 2,
  },
  {
    latitude: 55.8507889447758,
    longitude: -4.30537304721066,
    image: "glasgow_climbing_centre",
    name: "Glasgow Climbing Centre",
    desc: "One of Scotland's first dedicated indoor climbing gyms, offering lead climbing, top rope routes, auto belays, and a bouldering area, all within a unique and spacious setting.",
    id: 3,
  },
  {
    latitude: 55.84850575031594,
    longitude: -4.197678578040989,
    image: "cuningar",
    name: "Cuningar Bouldering",
    desc: "The Cuningar Loop boulders are designed to introduce new climbers to the sport whilst providing challenges for the more experienced climber.",
    id: 4,
  },
  {
    latitude: 55.84850575031594,
    longitude: -4.374146466629311,
    image: "climbzone",
    name: "Climbzone",
    desc: "Climbzone, Braehead is Glasgow’s premier indoor adventure park. A perfect playground for all ages and thrill seekers and home to the UK’s tallest indoor slide!",
    id: 5,
  },
];

const boulderingGrades: string[] = [
  "orange", // V0
  "wheat", // V1
  "yellow", // V2
  "green", // V3
  "red", // V4
  "tomato", // V5
  "linen", // V6
  "aqua", // V7
  "blue", // V8
  "purple", // V9
  "indigo", // V10+
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

  const { getUser } = useSession();
  const user = getUser();

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

  //fetch posts to grab climbs
  const { data } = useQuery<Post[]>("/posts/fetch");
  // console.log(data);

  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setRefresh((prev) => prev + 1); // Increment to force a re-render
  }, [data, location]);

  //actual app render
  return (
    <View style={styles.map_container}>
      <MapView
        key={refresh}
        style={styles.map} //@ts-ignore
        cluster={false}
        provider={
          process.env.environment === "preview"
            ? PROVIDER_GOOGLE
            : PROVIDER_DEFAULT
        }
        initialRegion={setDefaultLocation()}
      >
        {/*render user location*/}
        {location !== null ? (
          <Marker

            key={`user-${location.coords.latitude}-${location.coords.longitude}`} //@ts-ignore
            coordinate={location.coords}
            onPress={() => {
              setBottomStateSpot(null);
              setBottomStatePost(null);
            }}
          >
            <Image
              source={require("../../assets/images/stickman.png")}
              style={{ height: 30, width: 10, resizeMode: "contain" }}
            />
          </Marker>
        ) : null}
        {/*render default location*/}
        {DefaultPoints.map((point) => (
          <Marker
            key={point.name + point.id} //@ts-ignore
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
        {/*render users posts location*/}
        {data?.map((post) => (
          <Marker
            key={`${post.title}-${post.id}-${post.climb.lat}-${post.climb.lon}`} //@ts-ignore
            coordinate={{
              latitude: post.climb.lat,
              longitude: post.climb.lon,
            }}
            pinColor={
              post.user_id === user?.id
                ? "#EEEEEE"
                : post.climb.level >= 10
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
            <Text style={styles.headingMedium}>{bottomStateSpot.name}</Text>
            <Entypo
              name="cross"
              size={24}
              color="black"
              onPress={() => setBottomStateSpot(null)}
            />
          </View>
          <ScrollView style={{ padding: 0 }}>
            <Image
              source={
                bottomStateSpot.image
                  ? spot_images[bottomStateSpot.image]
                  : spot_images.newsroom
              }
              contentFit="cover"
              style={{ width: "100%", height: 300 }}
            />
            <Text
              style={{ marginTop: 20, textAlign: "center", ...styles.text }}
            >
              {bottomStateSpot.desc + "\n"}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#f00",
                justifyContent: "center",
                borderRadius: 5,
                paddingVertical: 8,
              }}
            >
              <Link
                href={`https://www.google.com/maps/dir/?api=1&origin=${location?.coords.latitude},${location?.coords.longitude}&destination=${bottomStateSpot.latitude},${bottomStateSpot.longitude}`}
                style={styles.button_text}
              >
                Get directions
              </Link>
            </TouchableOpacity>
          </ScrollView>
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
            <Text style={styles.headingMedium}>
              Nº:{bottomStatePost.climb.lat}, Eº:{bottomStatePost.climb.lon}
            </Text>
            <Entypo
              name="cross"
              size={30}
              color="black"
              onPress={() => setBottomStatePost(null)}
            />
          </View>
          <ScrollView>
            <PostComponent {...bottomStatePost} fullWidth={false} />
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}
