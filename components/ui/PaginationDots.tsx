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
            index <= currentIndex ? styles.activeDot : styles.inactiveDot,
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
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 10,
  },
  activeDot: {
    backgroundColor: "#12A5B5",
  },
  inactiveDot: {
    backgroundColor: "#A0AEC0",
  },
});