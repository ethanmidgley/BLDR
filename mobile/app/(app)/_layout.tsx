import { router, Tabs, usePathname } from "expo-router";
import React from "react";
import { Alert, Button, Platform, TouchableOpacity, View } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { Text } from "react-native";
import { Redirect } from "expo-router";
import { useSession } from "@/context/context";
import {
  AntDesign,
  Feather,
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

  //This is the function used to show the logout alert when the logout button is pressed
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

  //This is the function used to show the help alert when the help button is pressed
  const help = () => {
    Alert.alert(
      "To use this page:",
      "1: Click the start button to begin your climb.\n2: Once you finish your climb, press the stop button.\n3: Make sure all the details are filled in.\n4: Submit your climb, then go to the history tab to view it and post it from there.\nExtreme Angle - This is your most extreme angle that you reached when you were completing your climb",
    );
  };

  const helpHistory = () => {
    Alert.alert(
      "To use this page:",
      "1: If you cannot see your climb pull down to refresh.\n2: Click on the climb you want to Post.\n3: Click on the post button to post your climb after adding an image.",
    );}

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
          title: "SKILLS",
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
          title: "MAP",
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
          title: "LOG",
          tabBarIcon: () => <AntDesign name="book" size={24} color="black" />,
          headerRight: () => (
            <Feather
              onPress={help}
              style={{ marginRight: 16 }}
              name="help-circle"
              size={24}
              color="black"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "HISTORY",
          headerShown: true,
          tabBarIcon: () => (
            <MaterialIcons name="history" size={24} color="black" />
          ),
          headerRight: () => (
            <Feather
              onPress={helpHistory}
              style={{ marginRight: 16 }}
              name="help-circle"
              size={24}
              color="black"
            />
          ),
          ...(pathname === "/history/post" && {
            headerTitle: "POST",
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
