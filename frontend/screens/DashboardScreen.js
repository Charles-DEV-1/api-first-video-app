import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";
import VideoCard from "../components/VideoCard";
import { videoAPI, authAPI } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DashboardScreen = ({ navigation }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const profileResponse = await authAPI.getProfile();
      setUser(profileResponse.data);

      const videoResponse = await videoAPI.getDashboard();
      setVideos(videoResponse.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // ✅ TAP VIDEO → GO TO PLAYER SCREEN
  const handleVideoPress = (video) => {
    navigation.navigate("VideoPlayer", {
      videoId: video._id,
    });
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("Login");
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome back</Text>
          <Text style={styles.userName}>{user?.email}</Text>
        </View>

        <TouchableOpacity onPress={handleLogout}>
          <Icon name="logout" size={24} color="#667eea" />
        </TouchableOpacity>
      </View>

      {/* VIDEO LIST */}
      <FlatList
        data={videos}
        keyExtractor={(item) => item._id.toString()} // ✅ FIXED
        renderItem={({ item }) => (
          <VideoCard video={item} onPress={() => handleVideoPress(item)} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  welcome: {
    fontSize: 14,
    color: "#666",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
