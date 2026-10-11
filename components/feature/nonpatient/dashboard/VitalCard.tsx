import React from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

const CHART_WIDTH = 140;
const CHART_HEIGHT = 44;

const buildChartPoints = (
  values: number[],
  width = CHART_WIDTH,
  height = CHART_HEIGHT,
) => {
  if (!values.length) return "";

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max === min ? Math.max(1, max) : max - min;
  const step = width / Math.max(values.length - 1, 1);

  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / range) * (height - 8) - 4;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
};

const buildFillPath = (
  values: number[],
  width = CHART_WIDTH,
  height = CHART_HEIGHT,
) => {
  const points = buildChartPoints(values, width, height);
  if (!points) return "";
  return `${points} L ${width.toFixed(1)} ${height.toFixed(1)} L 0 ${height.toFixed(
    1,
  )} Z`;
};

const getChartTicks = (values: number[], count = 4) => {
  if (!values.length) return Array.from({ length: count }, () => 0);

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const step = count > 1 ? range / (count - 1) : 0;

  return Array.from({ length: count }, (_, index) => max - index * step);
};

const formatTickValue = (value: number, type: "heart" | "temp") => {
  return type === "heart" ? Math.round(value).toString() : value.toFixed(1);
};

interface VitalCardProps {
  label: string;
  value: number;
  unit: string;
  icon: any;
  iconColor?: string;
  color?: string;
  backgroundColor: string;
  rangeText?: string;
  rangeDetail: string;
  rangeDotColor?: string;
  history: number[];
  chartGradientId: string;
  tickType: "heart" | "temp";
}

export default function VitalCard({
  label,
  value,
  unit,
  icon,
  iconColor,
  color = "#FFFFFF",
  backgroundColor,
  rangeText = "Normal Range",
  rangeDetail,
  rangeDotColor = "#FFFFFF",
  history,
  chartGradientId,
  tickType,
}: VitalCardProps) {
  const resolvedIconColor = iconColor || backgroundColor;

  return (
    <View style={[styles.vitalCard, { backgroundColor }]}>
      <View style={styles.vitalTop}>
        <View style={styles.vitalIconContainer}>
          <Image
            source={icon}
            style={[styles.vitalIcon, { tintColor: resolvedIconColor }]}
            resizeMode="contain"
          />
        </View>
        <View style={styles.vitalLabelContainer}>
          <Text style={styles.vitalLabel}>{label}</Text>
          <View style={styles.vitalValueRow}>
            <Text style={styles.vitalValue}>{value}</Text>
            <Text style={styles.vitalUnit}>{unit}</Text>
          </View>
          <View style={styles.rangeRow}>
            <View
              style={[styles.rangeDot, { backgroundColor: rangeDotColor }]}
            />
            <Text style={styles.rangeText}>{rangeText}</Text>
          </View>
          <Text style={styles.rangeDetail}>{rangeDetail}</Text>
        </View>
      </View>

      <View style={styles.graphWrapper}>
        <View style={styles.graphContainer}>
          <Svg height={CHART_HEIGHT} width="100%">
            <Defs>
              <LinearGradient id={chartGradientId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
                <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.02" />
              </LinearGradient>
            </Defs>
            <Path
              d={buildFillPath(history)}
              fill={`url(#${chartGradientId})`}
            />
            <Path
              d={buildChartPoints(history)}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
            />
          </Svg>
        </View>
        <View style={styles.graphTicks}>
          {getChartTicks(history).map((tick, index) => (
            <Text key={index} style={styles.tickLabel}>
              {formatTickValue(tick, tickType)}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  vitalCard: {
    width: "48%",
    borderRadius: 18,
    paddingTop: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  vitalTop: {
    paddingHorizontal: 14,
  },
  vitalIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  vitalIcon: {
    width: 22,
    height: 22,
  },
  vitalLabelContainer: {
    marginTop: 10,
  },
  vitalLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.92)",
    letterSpacing: 0.2,
  },
  vitalValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 3,
  },
  vitalValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  vitalUnit: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.95)",
    marginLeft: 2,
  },
  rangeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  rangeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 5,
  },
  rangeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  rangeDetail: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.88)",
    marginTop: 2,
  },
  graphWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 8,
  },
  graphTicks: {
    width: 28,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingVertical: 4,
    marginLeft: 4,
    right: 6,
  },
  tickLabel: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.88)",
  },
  graphContainer: {
    flex: 1,
    height: CHART_HEIGHT,
  },
});
