import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axiosInstance from "@/hooks/lib/axios";
import { triggerAppHaptic } from "@/context/HapticsContext";

export interface VitalInsightData {
  latestHeartRate: number | null;
  latestTemperature: number | null;
  heartRateTrend: "STABLE" | "ELEVATED" | "LOW" | "FLUCTUATING" | "UNKNOWN";
  temperatureTrend: "NORMAL" | "FEVER" | "LOW" | "UNKNOWN";
  observation: string;
}

export interface FirstAidStep {
  step: number;
  title: string;
  instruction: string;
}

export interface EmergencyIncidentAdvisoryResult {
  patientId: string;
  patientName: string;
  age?: number | null;
  gender?: string | null;
  medicalConditions?: string | null;
  vitalsCount: number;
  recentVitals: {
    recordedAt: string;
    heartRate: number;
    temperature: number;
    sensorContact: boolean;
  }[];
  assessmentSummary: string;
  vitalInsights: VitalInsightData;
  priorityLevel: "CRITICAL" | "HIGH" | "MODERATE";
  firstAidSteps: FirstAidStep[];
  caregiverPrecautions: string[];
  paramedicBriefing: string;
  generatedAt: string;
}

interface AIIncidentAdvisoryCardProps {
  patientId?: string;
  patientName?: string;
  visible?: boolean;
}

export default function AIIncidentAdvisoryCard({
  patientId,
  patientName,
  visible = true,
}: AIIncidentAdvisoryCardProps) {
  const [loading, setLoading] = useState(false);
  const [advisory, setAdvisory] =
    useState<EmergencyIncidentAdvisoryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);

  const fetchAdvisory = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(
        "/api/ai/v1/emergency-advisory",
        patientId ? { patientId } : {},
      );

      if (response.data?.success && response.data?.data) {
        setAdvisory(response.data.data);
      } else {
        throw new Error(response.data?.message || "Failed to load advisory");
      }
    } catch (err: any) {
      console.warn("AI Incident Advisory error:", err?.message || err);
      setError("AI analysis unavailable. Standard protocol applied.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchAdvisory();
    }
  }, [visible, patientId]);


  const toggleExpanded = () => {
    triggerAppHaptic("light");
    setExpanded((prev) => !prev);
  };

  const getPriorityBadgeColor = (level?: string) => {
    switch (level) {
      case "CRITICAL":
        return "#EF4444";
      case "HIGH":
        return "#F59E0B";
      default:
        return "#8B5CF6";
    }
  };

  const vitalsCount = advisory?.vitalsCount ?? 0;
  const latestHR = advisory?.vitalInsights?.latestHeartRate;
  const latestTemp = advisory?.vitalInsights?.latestTemperature;

  return (
    <View style={styles.container}>
      {/* Top Banner Card matching user reference design */}
      <View style={styles.headerCard}>
        <View style={styles.sparkleIconWrap}>
          <Ionicons name="sparkles" size={24} color="#9333EA" />
        </View>

        <View style={styles.headerTextWrap}>
          <View style={styles.titleRow}>
            <Text style={styles.headerTitle}>AI Incident Advisory</Text>
          </View>
          <Text style={styles.headerDescription}>
            Our AI instantly analyzes the emergency alert context and provides
            step-by-step first-aid and care instructions.
          </Text>
        </View>
      </View>

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color="#A855F7" />
          <View style={styles.loadingTextWrap}>
            <Text style={styles.loadingTitle}>
              Analyzing 10 Recent Vitals...
            </Text>
            <Text style={styles.loadingSubtitle}>
              Connecting to CareLink AI to correlate heart rate & temperature trends.
            </Text>
          </View>
        </View>
      )}

      {/* Error / Offline Retry Banner */}
      {!loading && error && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={18} color="#F87171" />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={fetchAdvisory} style={styles.retryBtn}>
            <Ionicons name="refresh" size={14} color="#FFFFFF" />
            <Text style={styles.retryBtnText}>Retry</Text>
          </Pressable>
        </View>
      )}

      {/* Advisory Content */}
      {!loading && advisory && (
        <View style={styles.contentWrap}>
          {/* Quick Vital Readings Summary Pills */}
          <View style={styles.vitalsBar}>
            {vitalsCount === 0 ? (
              <View style={[styles.vitalPill, styles.noVitalsPill]}>
                <Ionicons name="alert-circle" size={15} color="#F59E0B" />
                <Text style={styles.noVitalsPillText}>
                  No vital readings in database for {advisory.patientName || patientName || "this patient"}
                </Text>
              </View>
            ) : (
              <>
                {latestHR !== null && latestHR !== undefined ? (
                  <View style={styles.vitalPill}>
                    <Ionicons name="heart" size={14} color="#EF4444" />
                    <Text style={styles.vitalPillValue}>{latestHR} BPM</Text>
                    <Text style={styles.vitalPillLabel}>
                      {advisory.vitalInsights.heartRateTrend === "ELEVATED"
                        ? "High"
                        : advisory.vitalInsights.heartRateTrend === "LOW"
                        ? "Low"
                        : "HR"}
                    </Text>
                  </View>
                ) : null}

                {latestTemp !== null && latestTemp !== undefined ? (
                  <View style={styles.vitalPill}>
                    <Ionicons name="thermometer" size={14} color="#F59E0B" />
                    <Text style={styles.vitalPillValue}>{latestTemp}°C</Text>
                    <Text style={styles.vitalPillLabel}>
                      {advisory.vitalInsights.temperatureTrend === "FEVER"
                        ? "Fever"
                        : "Temp"}
                    </Text>
                  </View>
                ) : null}

                <View style={[styles.vitalPill, styles.vitalPillTelemetry]}>
                  <Ionicons name="analytics-outline" size={14} color="#8B5CF6" />
                  <Text style={styles.vitalPillTelemetryText}>
                    {vitalsCount} Vitals Analyzed
                  </Text>
                </View>
              </>
            )}
          </View>


          {/* Assessment Summary Callout */}
          {advisory.assessmentSummary ? (
            <View style={styles.assessmentBox}>
              <View style={styles.assessmentHeader}>
                <Ionicons name="medical" size={16} color="#C084FC" />
                <Text style={styles.assessmentTitle}>Vital Assessment</Text>
              </View>
              <Text style={styles.assessmentText}>
                {advisory.assessmentSummary}
              </Text>
            </View>
          ) : null}

          {/* Step-by-step First-Aid Instructions */}
          {advisory.firstAidSteps && advisory.firstAidSteps.length > 0 && (
            <View style={styles.stepsSection}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>
                  Step-by-Step First Aid Protocol
                </Text>
                <Pressable onPress={toggleExpanded} style={styles.toggleBtn}>
                  <Text style={styles.toggleBtnText}>
                    {expanded ? "Collapse" : "Expand"}
                  </Text>
                  <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={14}
                    color="#C084FC"
                  />
                </Pressable>
              </View>

              {/* Render steps */}
              {(expanded
                ? advisory.firstAidSteps
                : advisory.firstAidSteps.slice(0, 2)
              ).map((stepItem, index) => (
                <View key={`step-${stepItem.step || index}`} style={styles.stepCard}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>
                      {stepItem.step || index + 1}
                    </Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>{stepItem.title}</Text>
                    <Text style={styles.stepInstruction}>
                      {stepItem.instruction}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Expanded Precautions & Paramedic Briefing */}
          {expanded && (
            <>
              {/* Caregiver Precautions */}
              {advisory.caregiverPrecautions &&
                advisory.caregiverPrecautions.length > 0 && (
                  <View style={styles.precautionsBox}>
                    <View style={styles.precautionHeader}>
                      <Ionicons
                        name="shield-checkmark-outline"
                        size={16}
                        color="#FBBF24"
                      />
                      <Text style={styles.precautionTitle}>
                        Caregiver Precautions
                      </Text>
                    </View>
                    {advisory.caregiverPrecautions.map((point, idx) => (
                      <View key={`precaution-${idx}`} style={styles.bulletRow}>
                        <View style={styles.bulletDot} />
                        <Text style={styles.bulletText}>{point}</Text>
                      </View>
                    ))}
                  </View>
                )}

              {/* Paramedic Briefing Callout */}
              {advisory.paramedicBriefing ? (
                <View style={styles.briefingBox}>
                  <View style={styles.briefingHeader}>
                    <Ionicons name="megaphone-outline" size={16} color="#60A5FA" />
                    <Text style={styles.briefingTitle}>
                      Paramedic / 911 Briefing
                    </Text>
                  </View>
                  <Text style={styles.briefingSubtitle}>
                    Read directly to emergency dispatchers or paramedics:
                  </Text>
                  <Text style={styles.briefingQuote}>
                    {`"${advisory.paramedicBriefing}"`}
                  </Text>
                </View>
              ) : null}
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#1E293B",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#475569",
    overflow: "hidden",
    marginVertical: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  headerCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "#0F172A",
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
    gap: 14,
  },
  sparkleIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#9333EA",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTextWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F8FAFC",
    letterSpacing: 0.2,
  },
  priorityPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityPillText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  headerDescription: {
    fontSize: 12,
    color: "#94A3B8",
    lineHeight: 17,
  },
  loadingBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(147, 51, 234, 0.08)",
    gap: 12,
  },
  loadingTextWrap: {
    flex: 1,
  },
  loadingTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#E2E8F0",
    marginBottom: 2,
  },
  loadingSubtitle: {
    fontSize: 11,
    color: "#94A3B8",
    lineHeight: 15,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderLeftWidth: 3,
    borderLeftColor: "#EF4444",
    gap: 10,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: "#FCA5A5",
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DC2626",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  retryBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  contentWrap: {
    padding: 16,
    gap: 12,
  },
  vitalsBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  vitalPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#334155",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  vitalPillValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  vitalPillLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
  },
  vitalPillTelemetry: {
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
  },
  vitalPillTelemetryText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#C084FC",
  },
  noVitalsPill: {
    flex: 1,
    backgroundColor: "rgba(245, 158, 11, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.35)",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  noVitalsPillText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#FCD34D",
    flexShrink: 1,
  },
  assessmentBox: {
    backgroundColor: "rgba(147, 51, 234, 0.12)",
    borderRadius: 12,
    borderLeftWidth: 3.5,
    borderLeftColor: "#A855F7",
    padding: 12,
  },
  assessmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  assessmentTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#E9D5FF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  assessmentText: {
    fontSize: 12.5,
    color: "#F1F5F9",
    lineHeight: 18,
  },
  stepsSection: {
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#F1F5F9",
    letterSpacing: 0.2,
  },
  toggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#C084FC",
  },
  stepCard: {
    flexDirection: "row",
    backgroundColor: "#0F172A",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#334155",
    gap: 10,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#9333EA",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#F8FAFC",
    marginBottom: 2,
  },
  stepInstruction: {
    fontSize: 12,
    color: "#CBD5E1",
    lineHeight: 17,
  },
  precautionsBox: {
    backgroundColor: "rgba(245, 158, 11, 0.08)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.25)",
    padding: 12,
    gap: 6,
  },
  precautionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  precautionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FCD34D",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#F59E0B",
    marginTop: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: 11.5,
    color: "#E2E8F0",
    lineHeight: 16,
  },
  briefingBox: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
    padding: 12,
  },
  briefingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  briefingTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#93C5FD",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  briefingSubtitle: {
    fontSize: 10.5,
    color: "#94A3B8",
    marginBottom: 6,
    fontStyle: "italic",
  },
  briefingQuote: {
    fontSize: 12,
    color: "#F8FAFC",
    fontWeight: "500",
    lineHeight: 17,
    fontStyle: "italic",
  },
});
