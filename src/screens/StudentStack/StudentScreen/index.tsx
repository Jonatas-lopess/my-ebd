import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "../../../theme";
import ThemedText from "../../../components/ThemedText";
import ThemedView from "../../../components/ThemedView";
import FocusAwareStatusBar from "../../../components/FocusAwareStatusBar";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { FlatList, Pressable, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

type Student = {
  id: string;
  name: string;
  birthday: string;
};

export default function StudentScreen() {
  const theme = useTheme<ThemeProps>();
  const navigation = useNavigation();
  const [birthdayFilter, setBirthdayFilter] = useState(false);
  const [nameFilter, setNameFilter] = useState("");

  const DATA: Student[] = [
    { id: "eqEQ213", name: "João", birthday: "07/12" },
    { id: "eqEQ210", name: "Maria", birthday: "18/06" },
    { id: "eqEQ221", name: "Pedro", birthday: "21/03" },
  ];

  const matchMounth = (item: Student) => {
    const [_, month] = item.birthday.split("/").map(Number);
    return month === new Date().getMonth() + 1;
  };

  const DATA_FILTERED = DATA.filter((item) => {
    if (birthdayFilter) return matchMounth(item);
    if (nameFilter) {
      return item.name.includes(nameFilter);
    }
    return true;
  });

  return (
    <ThemedView flex={1} style={{ backgroundColor: "#fff" }}>
      <FocusAwareStatusBar style="dark" translucent />

      <ThemedView
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        mt="safeArea"
        py="m"
        mx="s"
      >
        <ThemedView flexDirection="row" alignItems="center">
          <ThemedText color="secondary" fontSize={26} fontWeight="bold" pr="s">
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
          size={25}
          backgroundColor="transparent"
          underlayColor="transparent"
          iconStyle={{ marginRight: 0 }}
        />
      </ThemedView>

      <TextInput
        placeholder="Pesquisar por nome"
        value={nameFilter}
        onChangeText={setNameFilter}
        style={{
          backgroundColor: theme.colors.white,
          borderRadius: 20,
          padding: theme.spacing.s,
          marginBottom: theme.spacing.s,
          marginHorizontal: theme.spacing.s,
        }}
      />

      <FlatList
        data={DATA_FILTERED}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate("Cadastros", {
                screen: "Alunos_Historico",
                params: { studentId: item.id },
              })
            }
          >
            <ThemedView
              py="s"
              px="m"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              borderRadius={20}
              style={{ backgroundColor: "#fff" }}
            >
              <ThemedText fontSize={16}>{item.name}</ThemedText>
              {matchMounth(item) && (
                <ThemedView flexDirection="row" alignItems="center" gap="s">
                  <ThemedText color="secondary">{item.birthday}</ThemedText>
                  <FontAwesome
                    name="birthday-cake"
                    color={theme.colors.secondary}
                    size={18}
                  />
                </ThemedView>
              )}
            </ThemedView>
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
        style={{
          backgroundColor: theme.colors.white,
          height: "100%",
        }}
        contentContainerStyle={{
          gap: theme.spacing.s,
          marginTop: theme.spacing.s,
          paddingHorizontal: theme.spacing.s,
        }}
      ></FlatList>
    </ThemedView>
  );
}
