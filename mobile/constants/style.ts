import { Platform, StyleSheet } from "react-native";

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
    height: "60%",
    backgroundColor: "white",
    padding: 16,
    elevation: 5, // Adds a shadow effect
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontSize: 14,
    fontFamily: "Archivo_500Medium",
  },

  link: {
    fontSize: 14,
    color: "#00f",
  },

  h1: {
    textAlign: "center",
    fontFamily: "Archivo_700Bold_Italic",
    fontSize: 40,
    color: "#f00",
    marginVertical: 20,
  },

  h2: {
    textAlign: "center",
    fontFamily: "Archivo_600Medium",
    fontSize: 30,
    color: "#f00",
    marginVertical: 20,
  },

  headingLarge: {
    fontSize: 40,
    fontFamily: "Archivo_700Bold_Italic",
  },

  headingMedium: {
    fontFamily: "Archivo_500Medium",
    fontSize: 30,
  },

  headingSmall: {
    fontSize: 22,
    fontFamily: "Archivo_400Regular",
  },

  input: {
    width: "75%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 18,
    margin: 5,
  },

  button: {
    width: "40%",
    height: "6%",
    paddingVertical: 4,
    marginVertical: 20,
    borderRadius: 5,
    justifyContent: "center",
    backgroundColor: "#f00",
  },

  button_text: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    color: "#fff",
  },

  reply_button: {
    alignSelf: "flex-end",
    position: "absolute",
    padding: 1,
    borderRadius: 5,
  },

  image: {
    width: 300,
    height: 100,
    resizeMode: "contain",
  },

  climb_info_spacing: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
  },

  button_log_page: {
    // width: "100%",
    height: 50,
    marginVertical: 1,
    borderRadius: 9,
    flex: 1,
    backgroundColor: "#f00",
    marginBottom: 50,
    flexDirection: "row",
    textAlign: "center",
  },

  button_positioning: {
    flex: 1,
    height: "30%",
  },

  button_log_submission: {
    width: "100%",
    height: "30%",
    marginVertical: 20,
    borderRadius: 10,
    justifyContent: "center",
    backgroundColor: "#f00",
  },

  date: {
    padding: 5,
  },

  image_record: {
    width: 350,
    height: 60,
    resizeMode: "contain",
    alignSelf: "center",
    marginVertical: 0,
    marginTop: 0,
    marginBottom: 0,
  },

  picker: {
    height: 60,
    width: 250,
  },

  //reply: {
  //justifyContent: "end",
  //justifyContent: "flex-end",
  //textAlign: "right",
  //color: "red",
  //},

  dropdown: {
    width: 190,
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },

  placeholderStyle: {
    fontSize: 16,
  },

  selectedTextStyle: {
    fontSize: 16,
  },

  iconStyle: {
    width: 20,
    height: 20,
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },

  selectedOption: {
    marginTop: 20,
    fontSize: 18,
  },

  image2: {
    width: 200,
    height: 200,
    marginTop: 10,
    resizeMode: "contain",
  },

  banner: {
    borderRadius: 4,
    padding: 20,
    alignItems: "center",
    marginBottom: 8,
  },
  bannerText: {
    fontStyle: "italic",
    color: "red",
    fontSize: 42,
    fontWeight: "bold",
    fontFamily: "Archivo_700Bold_Italic",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "black",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  icon: {
    width: 80,
    height: 37,
    resizeMode: "contain",
    paddingTop: 10,
    paddingLeft:5,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "flex-end",
    flexGrow:1,
  },
  buttonContainer: {
    marginTop:20,
    justifyContent: "flex-end",
    flexGrow:1,
  },
});
