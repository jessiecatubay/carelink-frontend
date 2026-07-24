import { StyleSheet, View } from "react-native";

type Props = {
  currentIndex: number;
  total: number;
};

export default function PaginationDots({
  currentIndex,
  total,
}: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  activeDot: {
    backgroundColor: "#06b6d4",
  },
  inactiveDot: {
    backgroundColor: "#9ca3af",
  },
});