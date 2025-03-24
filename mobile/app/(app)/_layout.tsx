import { router, Tabs, usePathname } from "expo-router";
import React from "react";
import { Alert, Button, Platform, View } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { Text } from "react-native";
import { Redirect } from "expo-router";
import { useSession } from "@/context/context";
import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { styles } from "@/constants/style";

export default function TabLayout() {
  const { session, isLoading, signOut } = useSession();
  const pathname = usePathname();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/login" />;
  }

  const confirmSignOut = () => {
    Alert.alert("Logout?", "Are you sure you sure you want to log out?", [
      {
        text: "No",
      },
      {
        text: "Yes",
        onPress: signOut,
      },
    ]);
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleStyle: styles.headingLarge,
        headerStyle: { height: 110 },
        headerTitleAlign: "left",
        tabBarActiveTintColor: "#f00",
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            // position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="skills"
        options={{
          title: "Skills",
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="lightbulb-on-outline"
              size={24}
              color="black"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="locations"
        options={{
          title: "Map",
          headerShown: false,
          tabBarIcon: () => (
            <FontAwesome name="map-o" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "BLDR",
          headerRight: () => (
            <AntDesign
              style={{ marginRight: 16 }}
              onPress={confirmSignOut} //maybe add small vibration here?!?!
              name="logout"
              size={24}
              color="black"
            />
          ),
          tabBarIcon: () => <AntDesign name="home" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: "Log",
          tabBarIcon: () => <AntDesign name="book" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          headerShown: true,
          tabBarIcon: () => (
            <MaterialIcons name="history" size={24} color="black" />
          ),
          ...(pathname === "/history/post" && {
            headerTitle: "Post",
            headerLeft: () => (
              // It is 8 and not the proper 16 cos the button by default has set 8
              <View style={{ marginLeft: 8 }}>
                <Button title="Back" onPress={() => router.back()} />
              </View>
            ),
            headerTitleAlign: "center",
          }),
        }}
      />
    </Tabs>
  );
}
