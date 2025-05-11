import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0f172a",
  },

  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
    color: "#e5e7eb",
  },

  // Card
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  card: {
    padding: 28,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },

  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fcd34d",
    marginBottom: 12,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  questionText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
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

  counterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#9ca3af", // muted gray
  },

  header: {
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    opacity: 0.7,
  },

  // Footer hints
  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 32,
    paddingBottom: 15,
  },

  swipeHintText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#e5e7eb",
    textAlign: "center",
    opacity: 0.7,
  },

  // Modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },

  modalContent: {
    width: "80%",
    padding: 24,
    borderRadius: 12,
    backgroundColor: "#1f2937",
    alignItems: "center",
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
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    backgroundColor: "#10b981", // emerald
  },

  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },

  // Swipe hue overlays
  hue: {
    position: "absolute",
    width: "200%",
    height: "200%",
    zIndex: 0,
  },

  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default styles;
