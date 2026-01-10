import {
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import CustomIcon from "@components/CustomIcon";
import { StackActions, useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import config from "config";
import { useState } from "react";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import StorageService from "@services/StorageService";

export default function PlanScreen() {
  const navigation = useNavigation();
  const [isVisible, setVisibility] = useState<boolean>(false);

  async function handlePress() {
    try {
      await StorageService.setItem("hasSeenIntro", "true");
    } catch (err) {
      console.warn("Failed to set hasSeenIntro:", err);
    }

    navigation.dispatch(StackActions.replace("Signin"));
  }

  const { mutate } = useMutation({
    mutationFn: async () => {
      const response = await fetch(config.apiBaseUrl + "/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return await response.json();
    },
    onMutate: () => setVisibility(true),
    onSuccess: (data) => {
      setVisibility(false);
      
      try {
        StorageService.setItem("hasSeenIntro", "true");
      } catch (err) {
        console.warn("Failed to set hasSeenIntro:", err);
      }

      navigation.dispatch(StackActions.replace("Signin", { code: data.code }));
    },
    onError: (err) => {
      setVisibility(false);
      console.log(err.message, err.cause);
      Alert.alert(
        "Algo deu errado!",
        "Tente novamente mais tarde ou entre em contato conosco..."
      );
    },
  });

  return (
    <ThemedView flex={1} justifyContent="center" p="l" g="s">
      <FocusAwareStatusBar style="dark" translucent />
      
      <ThemedView flexDirection="row" alignItems="flex-end" marginBottom="s">
        <ThemedText fontSize={44} fontWeight="700" color="black">
          R$29
        </ThemedText>
        <ThemedText fontSize={14} color="gray" marginBottom="s">
          / mensal
        </ThemedText>
      </ThemedView>

      <ThemedView marginBottom="m">
        <ThemedView style={styles.featureRow}>
          <CustomIcon name="checkmark-circle" color="#28a745" size={20} />
          <ThemedText style={styles.featureText}>Uso Ilimitado</ThemedText>
        </ThemedView>
        <ThemedView style={styles.featureRow}>
          <CustomIcon name="checkmark-circle" color="#28a745" size={20} />
          <ThemedText style={styles.featureText}>
            Cadastro de Professores e Administradores
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.featureRow}>
          <CustomIcon name="checkmark-circle" color="#28a745" size={20} />
          <ThemedText style={styles.featureText}>
            Geração de Relatórios
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.actionButton}
        onPress={handlePress}
      >
        <ThemedText color="white" fontWeight="700" fontSize={18}>
          Assinar Plano
        </ThemedText>
      </TouchableOpacity>

      <ThemedText color="gray" my="m" textAlign="center">
        Se sua igreja sede já tem um Plano e você quer usá-lo, clique no botão
        abaixo:
      </ThemedText>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.actionButton2}
        onPress={handlePress}
      >
        <ThemedText color="gray" fontWeight="700" fontSize={16}>
          Cadastrar como Filial
        </ThemedText>
      </TouchableOpacity>

      <Modal visible={isVisible} transparent animationType="fade">
        <ThemedView flex={1} justifyContent="center" alignItems="center">
          <ThemedText>Aguarde...</ThemedText>
          <ActivityIndicator size="large" color="primary" />
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  perMonth: {
    fontSize: 14,
    color: "#8F9BB3",
    marginBottom: 6,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#222",
  },
  actionButton: {
    backgroundColor: "#2359CF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  actionButton2: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
