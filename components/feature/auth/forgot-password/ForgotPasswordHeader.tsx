import { Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native";
import Logo from "@/components/common/Logo";

type ForgotPasswordHeaderProps = {
  title: string;
  icon?: ImageSourcePropType;
  showLogo?: boolean;
};

export default function ForgotPasswordHeader({
  title,
  icon,
  showLogo = true,
}: ForgotPasswordHeaderProps) {
  return (
    <View style={styles.container}>
      {showLogo && (
        <View style={styles.logoWrap}>
          <Logo />
        </View>
      )}

      {title ? <Text style={styles.title}>{title}</Text> : null}

      {icon && (
        <View style={styles.heroWrap}>
          <Image source={icon} style={styles.heroIcon} resizeMode="contain" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
  },
  logoWrap: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#12A5B5",
    textAlign: "center",
    marginBottom: 16,
  },
  heroWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  heroIcon: {
    width: 110,
    height: 110,
  },
});
