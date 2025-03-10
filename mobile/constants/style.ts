import { Platform, StyleSheet } from "react-native";


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  text: {
    fontSize: 14,
  },

  link: {
    fontSize: 14,
    color: "#00f"
  },

  h1: {
    textAlign: "center",
    fontSize: 40,
    color: "#f00",
    fontWeight: "bold",
    marginVertical: 20
  },

  input: {
    width: "75%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 18,
    margin: 5
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

  button_log_page: {
    width: "50%",
    height: "30%",
    marginVertical: 20,
    borderRadius: 9,
    justifyContent: "center",
    backgroundColor: "#f00",
  },

  
  button_log_submission: {
    width: "100%",
    height: "30%",
    marginVertical: 20,
    borderRadius: 9,
    justifyContent: "center",
    backgroundColor: "#f00",
  },

  button_text: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    color: "#fff"
  },

  image: {
    width: 300,
    height: 100,
    resizeMode: "contain"
  },

  history_container: {
    padding: 10
  },

})
