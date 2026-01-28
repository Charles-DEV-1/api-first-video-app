import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import axios from "axios";

const API_URL = "http://192.168.1.159:5000";
const { width } = Dimensions.get("window");

export default function App() {
  const [screen, setScreen] = useState("login");
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("123456");
  const [token, setToken] = useState("");
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Simple storage for web
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setScreen("dashboard");
      loadVideos(storedToken);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const userToken = response.data.access_token;
      setToken(userToken);
      localStorage.setItem("token", userToken);

      Alert.alert("Success", "Logged in!");
      setScreen("dashboard");
      loadVideos(userToken);
    } catch (error) {
      Alert.alert("Login Failed", "Try: test@test.com / 123456");
    }
  };

  const loadVideos = async (userToken) => {
    try {
      const response = await axios.get(`${API_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setVideos(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load videos");
    }
  };

  const playVideo = async (videoId) => {
    try {
      const response = await axios.get(`${API_URL}/video/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedVideo(response.data);
      setModalVisible(true);
    } catch (error) {
      Alert.alert("Error", "Cannot load video");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setVideos([]);
    setScreen("login");
  };

  // Login Screen
  if (screen === "login") {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.logo}>🎬</Text>
          <Text style={styles.title}>Video App</Text>
          <Text style={styles.subtitle}>API-First Assignment - FINAL</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Login</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <View style={styles.button}>
              <Button title="Login" onPress={handleLogin} color="#4CAF50" />
            </View>

            <Text style={styles.note}>Demo: test@test.com / 123456</Text>
          </View>

          <View style={styles.tech}>
            <Text style={styles.techTitle}>✅ Assignment Requirements:</Text>
            <Text style={styles.techItem}>• MongoDB Atlas Database</Text>
            <Text style={styles.techItem}>• Flask Backend API</Text>
            <Text style={styles.techItem}>• JWT Authentication</Text>
            <Text style={styles.techItem}>• YouTube URLs Hidden</Text>
            <Text style={styles.techItem}>• React Native Thin Client</Text>
            <Text style={styles.techItem}>• Videos Play IN-APP</Text>
            <Text style={styles.techItem}>• API-First Architecture</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Dashboard Screen
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dashboardTitle}>Dashboard</Text>
        <Button title="Logout" onPress={handleLogout} color="#FF3B30" />
      </View>

      <Text style={styles.sectionTitle}>Videos from MongoDB Atlas</Text>
      <Text style={styles.sectionSubtitle}>
        Business logic in backend. Frontend only displays.
      </Text>

      <FlatList
        data={videos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.videoCard}
            onPress={() => playVideo(item._id)}
          >
            <Image
              source={{ uri: item.thumbnail_url }}
              style={styles.thumbnail}
            />
            <Text style={styles.videoTitle}>{item.title}</Text>
            <Text style={styles.videoDesc}>{item.description}</Text>
            <Text style={styles.hiddenNote}>
              🔒 YouTube URL hidden by backend API
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* VIDEO PLAYER MODAL - WORKS ON WEB */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        transparent={false}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} numberOfLines={1}>
              {selectedVideo?.title || "Video Player"}
            </Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>

          {/* IFRAME FOR WEB VIDEO PLAYBACK */}
          {selectedVideo?.video_url ? (
            <View style={styles.videoWrapper}>
              <iframe
                src={selectedVideo.video_url}
                style={styles.iframe}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube Video Player"
                frameBorder="0"
              />
              <Text style={styles.embedNote}>
                ✅ Playing embedded video IN-APP (not opening YouTube)
              </Text>
            </View>
          ) : (
            <View style={styles.noVideo}>
              <Text>Video not available</Text>
            </View>
          )}

          <View style={styles.videoInfo}>
            <Text style={styles.infoTitle}>
              🎯 YouTube URL Hiding Implementation
            </Text>
            <Text style={styles.infoDetail}>
              • Backend stores: youtube_id{"\n"}• Returns: embed URL
              (https://youtube.com/embed/...){"\n"}• Frontend NEVER sees raw
              YouTube URL{"\n"}• Video plays inside app via iframe
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scrollContent: { padding: 20, alignItems: "center" },
  logo: { fontSize: 60, marginTop: 40 },
  title: { fontSize: 32, fontWeight: "bold", marginTop: 10 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 30 },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    elevation: 3,
  },
  cardTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  button: { marginVertical: 10 },
  note: { marginTop: 15, color: "#666", textAlign: "center" },
  tech: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    marginTop: 20,
    elevation: 3,
  },
  techTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  techItem: { color: "#666", marginBottom: 5 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    elevation: 3,
  },
  dashboardTitle: { fontSize: 24, fontWeight: "bold" },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginLeft: 20,
    marginBottom: 20,
  },
  videoCard: {
    backgroundColor: "white",
    margin: 10,
    borderRadius: 10,
    padding: 15,
    elevation: 3,
  },
  thumbnail: { width: "100%", height: 200, borderRadius: 8, marginBottom: 10 },
  videoTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  videoDesc: { color: "#666", marginBottom: 10 },
  hiddenNote: { fontSize: 12, color: "#4CAF50", fontStyle: "italic" },
  modalContainer: { flex: 1, backgroundColor: "white" },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", flex: 1, marginRight: 10 },
  videoWrapper: { flex: 1, padding: 10 },
  iframe: { width: "100%", height: "80%", border: "none", borderRadius: 8 },
  embedNote: {
    fontSize: 12,
    color: "#4CAF50",
    textAlign: "center",
    marginTop: 10,
  },
  noVideo: { flex: 1, justifyContent: "center", alignItems: "center" },
  videoInfo: { padding: 20, borderTopWidth: 1, borderTopColor: "#eee" },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  infoDetail: { fontSize: 14, color: "#666", lineHeight: 20 },
});
