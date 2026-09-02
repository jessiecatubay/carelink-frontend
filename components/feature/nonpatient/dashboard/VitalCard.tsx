import React from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

const CHART_WIDTH = 140;
const CHART_HEIGHT = 40;

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
      const y = height - ((value - min) / range) * height;
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
  color: string;
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
  color,
  backgroundColor,
  rangeText = "Normal Range",
  rangeDetail,
  rangeDotColor = "#48BB78",
  history,
  chartGradientId,
  tickType,
}: VitalCardProps) {
  return (
    <View style={[styles.vitalCard, { backgroundColor }]}>
      <View style={styles.vitalTop}>
        <View style={styles.vitalIconContainer}>
          <Image
            source={icon}
            style={styles.vitalIcon}
            resizeMode="contain"
          />
        </View>
        <View style={styles.vitalLabelContainer}>
          <Text style={styles.vitalLabel}>{label}</Text>
          <View style={styles.vitalValueRow}>
            <Text style={[styles.vitalValue, { color }]}>
              {value}
            </Text>
            <Text style={[styles.vitalUnit, { color }]}>
              {unit}
            </Text>
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
                <Stop offset="0%" stopColor={color} stopOpacity="0.2" />
                <Stop
                  offset="100%"
                  stopColor={color}
                  stopOpacity="0.0"
                />
              </LinearGradient>
            </Defs>
            <Path
              d={buildFillPath(history)}
              fill={`url(#${chartGradientId})`}
            />
            <Path
              d={buildChartPoints(history)}
              fill="none"
              stroke={color}
              strokeWidth="2"
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
    borderRadius: 16,
    paddingTop: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#A0AEC0",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  vitalTop: {
    paddingHorizontal: 14,
  },
  vitalIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#A0AEC0",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  vitalIcon: {
    width: 20,
    height: 20,
  },
  vitalLabelContainer: {
    marginTop: 10,
  },
  vitalLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4A5568",
  },
  vitalValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
  },
  vitalValue: {
    fontSize: 28,
    fontWeight: "700",
  },
  vitalUnit: {
    fontSize: 14,
    fontWeight: "600",
  },
  rangeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  rangeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  rangeText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#718096",
  },
  rangeDetail: {
    fontSize: 11,
    color: "#A0AEC0",
    marginTop: 2,
  },
  graphWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 10,
  },
  graphTicks: {
    width: 25,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingVertical: 4,
    marginLeft: 8,
    right: 5,
  },
  tickLabel: {
    fontSize: 10,
    color: "#718096",
  },
  graphContainer: {
    flex: 1,
    height: 50,
  },
});
