// import React from "react";
// import { TouchableOpacity, Text, StyleSheet } from "react-native";
// import LinearGradient from "react-native-linear-gradient";

// const GradientButton = ({ title, onPress, style }) => {
//   return (
//     <TouchableOpacity onPress={onPress} style={[styles.buttonContainer, style]}>
//       <LinearGradient
//         colors={["#667eea", "#764ba2"]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//         style={styles.gradient}
//       >
//         <Text style={styles.buttonText}>{title}</Text>
//       </LinearGradient>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   buttonContainer: {
//     borderRadius: 25,
//     overflow: "hidden",
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//   },
//   gradient: {
//     paddingVertical: 15,
//     paddingHorizontal: 40,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

// export default GradientButton;

import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const GradientButton = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#667eea",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default GradientButton;
