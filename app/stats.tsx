import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import {
  getAllStats,
  getCategoryEngagement,
  clearHistory,
  CategoryId,
} from "./services";

interface CategoryEngagement {
  category: CategoryId;
  score: number;
  seen: number;
  total: number;
  likeRatio: number;
  name: string;
  color: string;
}

const CATEGORY_META: Record<
  CategoryId,
  { name: string; color: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  chill: {
    name: "Chill",
    color: "rgba(251, 191, 36, 0.9)",
    icon: "sparkles-outline",
  },
  "real talk": {
    name: "Real Talk",
    color: "rgba(147, 197, 253, 0.85)",
    icon: "chatbubble-ellipses-outline",
  },
  relationships: {
    name: "Relationships",
    color: "rgba(97, 185, 129, 0.85)",
    icon: "heart-outline",
  },
  sex: { name: "Sex", color: "rgba(239, 68, 68, 0.9)", icon: "flame-outline" },
  dating: {
    name: "Dating",
    color: "rgba(244, 114, 182, 0.9)",
    icon: "people-outline",
  },
  "t/d": {
    name: "Truth or Dare",
    color: "rgba(154, 0, 151, 0.9)",
    icon: "dice-outline",
  },
};

export default function StatsScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<{
    totalSeen: number;
    totalLiked: number;
    totalSkipped: number;
  } | null>(null);
  const [categoryEngagements, setCategoryEngagements] = useState<
    CategoryEngagement[]
  >([]);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setIsLoading(true);
    try {
      const allStats = await getAllStats();
      setStats({
        totalSeen: allStats.totalSeen,
        totalLiked: allStats.totalLiked,
        totalSkipped: allStats.totalSkipped,
      });

      // Get engagement for each category
      const categories = Object.keys(CATEGORY_META) as CategoryId[];
      const engagements: CategoryEngagement[] = [];

      for (const category of categories) {
        const engagement = await getCategoryEngagement(category);
        const meta = CATEGORY_META[category];
        engagements.push({
          category,
          ...engagement,
          name: meta.name,
          color: meta.color,
        });
      }

      setCategoryEngagements(engagements);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleClearHistory = () => {
    Alert.alert(
      "Clear History?",
      "This will reset all your question history and preferences. You'll see questions as if you're playing for the first time.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await clearHistory();
            await loadStats();
          },
        },
      ]
    );
  };

  const likeRatioPercent =
    stats && stats.totalSeen > 0
      ? Math.round((stats.totalLiked / stats.totalSeen) * 100)
      : 0;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={["#0f172a", "#2a3a50"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.background}
        />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="white" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#0f172a", "#2a3a50"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.background}
      />

      <Header onBack={() => router.back()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Your Stats</Text>
        <Text style={styles.subtitle}>See how you've been playing</Text>

        {/* Overall Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats?.totalSeen || 0}</Text>
            <Text style={styles.statLabel}>Seen</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: "#10b981" }]}>
              {stats?.totalLiked || 0}
            </Text>
            <Text style={styles.statLabel}>Liked</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: "#ef4444" }]}>
              {stats?.totalSkipped || 0}
            </Text>
            <Text style={styles.statLabel}>Skipped</Text>
          </View>
        </View>

        {/* Like Ratio */}
        {stats && stats.totalSeen > 0 && (
          <View style={styles.ratioContainer}>
            <Text style={styles.ratioText}>
              You've liked{" "}
              <Text style={{ color: "#10b981" }}>{likeRatioPercent}%</Text> of
              questions
            </Text>
            <View style={styles.ratioBar}>
              <View
                style={[
                  styles.ratioFill,
                  { width: `${likeRatioPercent}%`, backgroundColor: "#10b981" },
                ]}
              />
            </View>
          </View>
        )}

        {/* Category Breakdown - Shows like ratio per category */}
        <Text style={styles.sectionTitle}>Like Ratio</Text>
        {categoryEngagements.map((engagement) => {
          const likePercent = Math.round(engagement.likeRatio * 100);
          const hasPlayed = engagement.seen > 0;
          return (
            <View key={engagement.category} style={styles.categoryRow}>
              <View style={styles.categoryInfo}>
                <View
                  style={[
                    styles.categoryDot,
                    { backgroundColor: engagement.color },
                  ]}
                />
                <Text style={styles.categoryName}>{engagement.name}</Text>
              </View>
              <View style={styles.categoryProgress}>
                <View style={styles.progressBarContainer}>
                  {hasPlayed && (
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${likePercent}%`,
                          backgroundColor: engagement.color,
                        },
                      ]}
                    />
                  )}
                </View>
                <Text style={styles.categoryPercent}>
                  {hasPlayed ? `${likePercent}%` : ""}
                </Text>
              </View>
            </View>
          );
        })}

        {/* Info */}
        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#64748b"
          />
          <Text style={styles.infoText}>
            The app tracks which questions you've seen to show you fresh
            content. When you've seen most questions, we can generate new ones
            based on your preferences!
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleClearHistory}
          >
            <Ionicons name="refresh-outline" size={20} color="#ef4444" />
            <Text style={[styles.actionButtonText, { color: "#ef4444" }]}>
              Reset History
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 4,
    textAlign: "center",
  },
  ratioContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  ratioText: {
    fontSize: 16,
    color: "white",
    marginBottom: 12,
  },
  ratioBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  ratioFill: {
    height: "100%",
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    width: "38%",
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    color: "white",
  },
  categoryProgress: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryStats: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    width: 60,
    textAlign: "right",
    marginRight: 8,
  },
  progressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
    marginLeft: 8,
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  categoryPercent: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    width: 36,
    textAlign: "right",
    marginLeft: 6,
  },
  emptyText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.4)",
    textAlign: "center",
    marginVertical: 16,
    fontStyle: "italic",
  },
  actionsContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 10,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#64748b",
    marginLeft: 8,
    lineHeight: 18,
  },
});
