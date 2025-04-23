// import { StyleSheet } from "react-native";

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "space-between", // Ensures proper spacing
//     alignItems: "center",
//     paddingBottom: 20, // Prevents footer overlap
//   },

//   loadingText: { fontSize: 18, textAlign: "center", marginTop: 50 },

//   cardContainer: {
//     flex: 1, // Allows it to expand naturally
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1,
//   },

//   card: {
//     borderRadius: 20,
//     padding: 20,
//     justifyContent: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 10,
//   },

//   categoryText: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 10,
//   },

//   questionText: {
//     color: "white",
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     lineHeight: 32,
//   },

//   logoText: {
//     position: "absolute",
//     bottom: 10,
//     alignSelf: "center",
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "rgba(255, 255, 255, 0.5)",
//   },

//   header: {
//     width: "100%",
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     marginTop: 15,
//   },

//   backButton: {
//     marginLeft: 10,
//   },

//   counterText: { color: "#fff", fontSize: 14 },

//   background: { ...StyleSheet.absoluteFillObject },

//   footer: {
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 50,
//     margin: 20,
//     opacity: 0.5,
//   },

//   swipeHintText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "500",
//   },

//   modalContainer: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 10,
//     alignItems: "center",
//     width: "80%",
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   modalText: {
//     fontSize: 16,
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   modalButton: {
//     backgroundColor: "#FF512F",
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 8,
//   },
//   modalButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },

//   hue: {
//     position: "absolute",
//     width: "200%", // Make it much larger than the screen width
//     height: "200%", // Make it much taller than the screen height
//     zIndex: 0,
//   },
//   absoluteFill: {
//     position: "absolute",
//     top: 0,
//     right: 0,
//     bottom: 0,
//     left: 0,
//   },
// });

// export default styles;

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0f172a", // deep navy background
    paddingBottom: 30,
    overflow: "hidden",
  },

  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
    color: "#e5e7eb", // soft white
  },

  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    paddingHorizontal: 20,
  },

  card: {
    borderRadius: 24,
    padding: 28,
    backgroundColor: "#ef4444", // red card example
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
    width: "100%",
  },

  categoryText: {
    color: "#fcd34d", // warm yellow
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
  },

  questionText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 34,
  },

  logoText: {
    position: "absolute",
    bottom: 14,
    alignSelf: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.3)",
  },

  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  backButton: {
    marginLeft: 10,
  },

  counterText: {
    color: "#9ca3af", // muted gray
    fontSize: 14,
    fontWeight: "500",
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0f172a",
  },

  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 32,
    paddingBottom: 20,
    opacity: 1, // visible buttons now
  },

  swipeHintText: {
    color: "#e5e7eb",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1f2937",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    color: "#cbd5e1",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#10b981", // emerald green
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  hue: {
    position: "absolute",
    width: "200%",
    height: "200%",
    zIndex: 0,
  },

  absoluteFill: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});

export default styles;
