import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "../../theme";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { TextInput, View } from "react-native";

export default function StudentScreen() {
  const theme = useTheme<ThemeProps>();
  const [birthdayFilter, setBirthdayFilter] = useState(false);
  const [nameFilter, setNameFilter] = useState("");

  return (
    <ThemedView flex={1} backgroundColor="white">
      <FocusAwareStatusBar style="dark" translucent />

      <ThemedView pt="safeArea" px="s">
        <View style={{ backgroundColor: "#fff" }}>
          <ThemedView
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <ThemedView flexDirection="row" alignItems="center">
              <ThemedText
                color="secondary"
                fontSize={26}
                fontWeight="bold"
                pr="s"
              >
                Minha EBD
              </ThemedText>
              <ThemedText color="gray" fontSize={20}>
                • Vila Mury
              </ThemedText>
            </ThemedView>
            <FontAwesome.Button
              name="birthday-cake"
              color={birthdayFilter ? theme.colors.primary : theme.colors.gray}
              onPress={() => setBirthdayFilter(!birthdayFilter)}
              backgroundColor="transparent"
              underlayColor="transparent"
            />
          </ThemedView>

          <TextInput
            placeholder="Pesquisar por nome"
            value={nameFilter}
            onChangeText={setNameFilter}
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: theme.spacing.s,
              marginTop: theme.spacing.l,
            }}
          />
        </View>
      </ThemedView>
    </ThemedView>
  );
}
