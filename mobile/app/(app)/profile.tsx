import React, { useEffect, useState } from "react";
import { styles } from "@/constants/style";
import { useQuery } from "@/hooks/useQuery";
import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { API_PATH } from "@/hooks/useApi";
import { Post, PostComponent } from "@/components/PostComponent";
import { useMutation } from "@/hooks/useMutation";
import { useSession } from "@/context/context";
import * as ImagePicker from "expo-image-picker";

type User = {
  fullname: string;
  image: string;
  bio: string;
};

type UserPostsResponse = {
  next_cursor: number | null;
  posts: Post[];
};

export default function Profile() {
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [editPfpVisible, setEditPfpVisible] = useState<boolean>(false);

  const [uri, setUri] = useState<string | null>(null);
  const [image_flag, set_image_flag] = useState(false);

  const handleChooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setUri(imageUri);
    }
  };

  const updatePfp = async () => {
    if (uri === ""){
      Alert.alert("Please upload an image");
      return;
    }

    try {
      const formData = new FormData();
      const localUri = uri;
      const filename = localUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename || "");
      const type = match ? `image/${match[1]}` : "image";

      formData.append("image", {
        uri: localUri,
        name: filename,
        type: type,
      });

      const response = await fetch(API_PATH + "/me/pfp", {
        method: "PATCH",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
        credentials: "include"
      });

      if (!response.ok) {
        Alert.alert("Error", "File must be less than 10MB");
      } else {
        return "success";
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to post data. Please try again.");
      return error;
    }
  };

  const [updateBio] = useMutation("/me", {method: "PATCH"});

  const { getUser } = useSession();

  const { user_id } = useLocalSearchParams<{ user_id: string }>();
  const {
    data,
    status,
    refetch: refetchUserData,
  } = useQuery<User>("/users/" + user_id);
  const [bio, setBio] = useState<string>("");
  const {
    data: postData,
    status: postStatus,
    refetch,
  } = useQuery<UserPostsResponse>("/users/" + user_id + "/posts");

  return (
    <View key={user_id}>
      {status === "success" ? (
        <>
          <Modal animationType="slide" transparent={true} visible={editPfpVisible}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 300,
                  backgroundColor: "white",
                  borderRadius: 20,
                  padding: 20,
                }}
              >
                <Text style={styles.headingLarge}>Edit Profile Picture</Text>

                <TouchableOpacity
                  style={{
                    backgroundColor: "#f00",
                    justifyContent: "center",
                    borderRadius: 5,
                    paddingVertical: 8,
                    alignSelf: "center",
                    padding: 10,
                    margin: 10,
                    width: "70%",
                    height: 50,
                  }}
                  onPress={handleChooseImage}
                >
                  <Text style={{ ...styles.button_text, color: "#fff" }}>
                    Select
                  </Text>
                </TouchableOpacity>
                {uri && (
                  <Image
                    source={{ uri: uri }}
                    style={{ ...styles.image, alignSelf: "center" }}
                  />
                )}

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    columnGap: 20,
                  }}
                >
                  <Pressable
                    style={[styles.button, { flex: 1, height: 30 }]}
                    onPress={() => setEditPfpVisible(false)}
                  >
                    <Text style={styles.button_text}>Close</Text>
                  </Pressable>
                  <Pressable style={[styles.button, { flex: 1, height: 30 }]}>
                    <Text
                      style={styles.button_text}
                      onPress={async () => {
                        const status = await updatePfp();
                        setEditPfpVisible(false);
                        if (status === "success") {
                          Alert.alert("Updated profile picture");
                          refetchUserData();
                        } else {
                          Alert.alert("Failed to update profile picture, try again later");
                        }
                      }}
                    >
                      Save
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
          <Modal animationType="slide" transparent={true} visible={editVisible}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 300,
                  backgroundColor: "white",
                  borderRadius: 20,
                  padding: 20,
                }}
              >
                <Text style={styles.headingLarge}>Edit Bio</Text>

                <TextInput
                  style={[styles.input, { width: "100%", marginTop: 20 }]}
                  value={bio}
                  placeholder="Enter bio"
                  onChangeText={setBio}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    columnGap: 20,
                  }}
                >
                  <Pressable
                    style={[styles.button, { flex: 1, height: 30 }]}
                    onPress={() => setEditVisible(false)}
                  >
                    <Text style={styles.button_text}>Close</Text>
                  </Pressable>
                  <Pressable style={[styles.button, { flex: 1, height: 30 }]}>
                    <Text
                      style={styles.button_text}
                      onPress={async () => {
                        const { status } = await updateBio({
                          body: { bio: bio },
                        });
                        setEditVisible(false);
                        if (status === "success") {
                          Alert.alert("Updated bio");
                          refetchUserData();
                        } else {
                          Alert.alert("Failed to update bio, try again later");
                        }
                      }}
                    >
                      Save
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>

          <FlatList
            ListHeaderComponent={() => (
              <>
                {/* main profile div */}
                <View style={{ width: "100%" }}>
                  <View
                    style={{
                      flex: 1,
                      width: "30%",
                      flexDirection: "row",
                      alignItems: "center",
                      marginHorizontal: 8,
                      marginTop: 14,
                    }}
                  >
                    <Image
                      source={`${API_PATH}/image/${data?.image}`}
                      contentFit="cover"
                      style={{
                        width: "100%",
                        borderRadius: "50%",
                        height: 120,
                        marginLeft: 5,
                        marginTop: 5,
                        borderWidth: 5,
                        borderColor: "#f00",
                      }}
                    />

                    <View
                      style={{
                        marginHorizontal: 20,
                        height: 120,
                        width: "190%",
                      }}
                    >
                      <Text
                        style={{ ...styles.headingLarge, textAlign: "center" }}
                      >
                        {data?.fullname}
                      </Text>
                      {getUser()?.id === parseInt(user_id) ? (
                        <TouchableOpacity onPress={() => setEditPfpVisible(true)}>
                          <Text
                            style={{
                              ...styles.button_text,
                              color: "#f00",
                              marginTop: 5,
                              textAlign: "right"
                            }}
                          >
                            Edit Picture
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                      {getUser()?.id === parseInt(user_id) ? (
                        <TouchableOpacity onPress={() => setEditVisible(true)}>
                          <Text
                            style={{
                              ...styles.button_text,
                              color: "#f00",
                              marginTop: 5,
                              textAlign: "right"
                            }}
                          >
                            Edit Bio
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>

                  <View
                    style={{
                      height: "auto",
                      marginHorizontal: 20,
                      marginTop: 15,
                      marginBottom: 15,
                      width: "90%",
                    }}
                  >
                    <Text style={{ ...styles.text, textAlign: "justify" }}>
                      {data?.bio}
                    </Text>
                  </View>

                  <View
                    style={{
                      borderBottomColor: 'black',
                      borderBottomWidth: 1,
                    }}
                  />

                  {/* uploads div */}
                </View>
              </>
            )}
            ListEmptyComponent={() => (
              <Text
                style={{
                  ...styles.headingMedium,
                  paddingTop: 150,
                  textAlign: "center",
                }}
              >
                This user has no posts
              </Text>
            )}
            style={{}}
            refreshing={postStatus === "loading"}
            onRefresh={refetch}
            data={postData?.posts}
            onEndReachedThreshold={2}
            onEndReached={async () => {
              if (postData?.next_cursor != null) {
                await refetch(
                  {
                    params: { next_cursor: postData?.next_cursor },
                  },
                  {
                    refetchPolicy: (oldData, newData) => ({
                      posts: [...oldData.posts, ...newData.posts],
                      next_cursor: newData.next_cursor,
                    }),
                  },
                );
              }
            }}
            renderItem={(d) => <PostComponent {...d.item} />}
          />
        </>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );
}
