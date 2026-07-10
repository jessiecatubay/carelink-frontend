import { View } from "react-native";

type Props = {
  currentIndex: number;
  total: number;
};

export default function PaginationDots({
  currentIndex,
  total,
}: Props) {
  return (
    <View className="flex-row items-center justify-center space-x-2">
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          className={`w-2 h-2 rounded-full ${
            index === currentIndex
              ? "bg-cyan-500"
              : "bg-gray-400"
          }`}
        />
      ))}
    </View>
  );
}