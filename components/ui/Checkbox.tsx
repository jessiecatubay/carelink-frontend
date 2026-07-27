import { Image, Pressable, StyleSheet } from "react-native";

type CheckboxProps = {
  checked: boolean;
  onPress: () => void;
};

export default function Checkbox({
  checked,
  onPress,
}: CheckboxProps) {
  return (
    <Pressable onPress={onPress}>
      <Image
        source={
          checked
            ? require("@/assets/icons/checkbox.png")
            : require("@/assets/icons/unchecked.png")
        }
        style={styles.image}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 20,
    height: 20,
  },
});