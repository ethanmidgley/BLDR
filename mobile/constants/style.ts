import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  map_container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  bottomView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
    backgroundColor: "white",
    padding: 16,
    elevation: 5, // Adds a shadow effect
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
});

export default styles;
