import React from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import introImg from "@assets/intro-illustration.png";
import { LoginStackParamList } from "@custom/types/navigation";
import { StackActions, useNavigation } from "@react-navigation/native";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";

export default function IntroScreen() {
  const navigation = useNavigation();

  function handleMove(screen: keyof LoginStackParamList) {
    //await StorageService.setItem("hasSeenIntro", "true");

    navigation.dispatch(StackActions.replace(screen));
  }

  return (
    <ThemedView
      flex={1}
      justifyContent="center"
      alignItems="center"
      g="s"
      p="l"
    >
      <FocusAwareStatusBar style="dark" translucent />
      
      <Image source={introImg} style={styles.illustration} />

      <ThemedText
        variant="h2"
        textAlign="center"
        marginBottom="m"
        fontWeight="700"
      >
        Bem Vindo
      </ThemedText>

      <ThemedView mb="m" g="s">
        <ThemedText textAlign="center" style={styles.subtitle}>
          Bem vindo ao Minha EBD — sua solução para administrar lições, classes
          e estudantes.
        </ThemedText>

        <ThemedText textAlign="center" style={styles.subtitle}>
          Como é sua primeira vez no aplicativo, gostaria de saber como poderia
          ajudá-lo!
        </ThemedText>
      </ThemedView>

      <View style={styles.options}>
        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.8}
          onPress={() => handleMove("Signin")}
        >
          <ThemedText style={styles.optionText}>
            Sou um <ThemedText fontWeight="bold">Administrador</ThemedText> ou{" "}
            <ThemedText fontWeight="bold">Professor</ThemedText> de uma igreja
            já cadastrada.
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, styles.primary]}
          activeOpacity={0.8}
          onPress={() => handleMove("PlanScreen")}
        >
          <ThemedText style={[styles.optionText, styles.primaryText]}>
            Sou um <ThemedText fontWeight="bold">Superintendente</ThemedText> e
            quero cadastrar minha igreja.
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  illustration: {
    width: 160,
    height: 160,
    marginBottom: 12,
    resizeMode: "contain",
  },
  subtitle: {
    color: "#6B7280",
    textAlign: "center",
  },
  options: {
    width: "100%",
  },
  option: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  primary: {
    backgroundColor: "#2359CF",
  },
  optionText: {
    fontSize: 14,
    color: "#111827",
    textAlign: "center",
  },
  primaryText: {
    color: "#fff",
    fontWeight: "700",
  },
});
