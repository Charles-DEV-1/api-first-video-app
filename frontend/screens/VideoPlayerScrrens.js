import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview"; // ← USE THIS
import { videoAPI } from "../services/api";

const { width } = Dimensions.get("window");

const VideoPlayerScreen = ({ route, navigation }) => {
  const { videoId } = route.params;
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideo();
  }, []);

  const loadVideo = async () => {
    try {
      const response = await videoAPI.getVideo(videoId);
      setVideo(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load video");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading video...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {video?.title}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* VIDEO PLAYER - WEBVIEW FOR YOUTUBE EMBED */}
      <View style={styles.videoContainer}>
        <WebView
          source={{ uri: video?.video_url }}
          style={styles.videoPlayer}
          allowsFullscreenVideo={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.webviewLoading}>
              <ActivityIndicator size="large" color="#667eea" />
              <Text style={{ color: "white", marginTop: 10 }}>
                Loading embedded video...
              </Text>
            </View>
          )}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.videoTitle}>{video?.title}</Text>
        <Text style={styles.videoDescription}>{video?.description}</Text>

        <View style={styles.techInfo}>
          <Text style={styles.techTitle}>🔒 YouTube URL Hiding</Text>
          <Text style={styles.techDetail}>
            • Backend stores: youtube_id{"\n"}• Returns embed URL:{" "}
            {video?.video_url}
            {"\n"}• Frontend never sees raw YouTube link
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    color: "white",
    marginTop: 20,
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    color: "#333",
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginHorizontal: 10,
  },
  placeholder: {
    width: 40,
  },
  videoContainer: {
    width: "100%",
    height: width * 0.5625, // 16:9 aspect ratio
    backgroundColor: "#000",
  },
  videoPlayer: {
    flex: 1,
  },
  webviewLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  infoContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  videoTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  videoDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 20,
  },
  techInfo: {
    marginTop: "auto",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  techTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  techDetail: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});

export default VideoPlayerScreen;
