import { triggerAppHaptic } from "@/context/HapticsContext";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        triggerAppHaptic("light");
        props.onPressIn?.(ev);
      }}
    />
  );
}
