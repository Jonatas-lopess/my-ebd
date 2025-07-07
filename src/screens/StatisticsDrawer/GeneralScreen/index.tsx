import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useTheme } from "@shopify/restyle";
import { useCallback, useState } from "react";
import { FlatList, ScrollView, SectionList } from "react-native";
import SwitchSelector from "react-native-switch-selector";
import CustomTextCard from "@components/CustomTextCard";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import IntervalControl, {
  IntervalOptionTypes,
} from "@components/IntervalControl";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { ThemeProps } from "@theme";
import { DataType } from "@screens/ClassStack/ClassDetails/type";
import { useQuery } from "@tanstack/react-query";
import config from "config";
import { useAuth } from "@providers/AuthProvider";
import { RegisterFromApi } from "@screens/StudentStack/StudentScreen/type";

export default function GeneralScreen() {
  const theme = useTheme<ThemeProps>();
  const navigation = useNavigation();
  const { token } = useAuth().authState;
  const [selectedList, setSelectedList] = useState("alunos");
  const [interval, setInterval] =
    useState<IntervalOptionTypes>("Últimas 13 aulas");

  /* const { data, error, isError, isPending } = useQuery({
    queryKey: ["register"],
    queryFn: async (): Promise<RegisterFromApi[]> => {
      const res = await fetch(config.apiBaseUrl + "/registers", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.message, { cause: resJson.error });

      return resJson;
    },
  }); */

  const DATA_STUDENTS: { title: string; data: DataType[] }[] = [];
  const DATA_TEACHERS: DataType[] = [];

  const handleCardPress = useCallback((newInterval: IntervalOptionTypes) => {
    setInterval(newInterval);
  }, []);

  const handleRenderItem = (item: DataType, index: number) => (
    <ThemedView flexDirection="row" gap="s">
      {index < 3 && (
        <ThemedView
          aspectRatio={1}
          width={35}
          borderRadius={100}
          alignItems="center"
          justifyContent="center"
          style={{ backgroundColor: "#fff" }}
        >
          <ThemedText>{`${index + 1}º`}</ThemedText>
        </ThemedView>
      )}
      <ThemedView
        flex={1}
        py="s"
        px="m"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        borderRadius={20}
        style={{
          backgroundColor: "#fff",
        }}
      >
        <ThemedText fontSize={16}>{item.nome}</ThemedText>
        <ThemedText>{item.pontos}</ThemedText>
      </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedView flex={1} backgroundColor="secondary">
      <FocusAwareStatusBar style="light" translucent />

      <ThemedView paddingTop="safeArea">
        <ScrollView nestedScrollEnabled>
          <ThemedView flexDirection="row" mx="s" mt="s" alignItems="center">
            <ThemedView flex={1} alignItems="center" pl="l">
              <ThemedText color="gray" variant="body" fontWeight="bold">
                Minha EBD
              </ThemedText>
            </ThemedView>
            <Ionicons.Button
              name="menu"
              color={theme.colors.gray}
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              size={25}
              backgroundColor="transparent"
              underlayColor="transparent"
              style={{ padding: 0 }}
              iconStyle={{ marginRight: 0 }}
            />
          </ThemedView>

          <ThemedView flexDirection="column" alignItems="center" mt="m">
            <ThemedText variant="h1" color="white">
              Escola Bíblica
            </ThemedText>
            <ThemedText variant="body" color="white">
              Vila Mury
            </ThemedText>
          </ThemedView>

          <ThemedView mt="m">
            <IntervalControl
              interval={interval}
              onCardPress={handleCardPress}
            />
          </ThemedView>

          <ThemedView
            flexDirection="row"
            mt="xxxl"
            justifyContent="space-around"
          >
            <CustomTextCard text="Matriculados: 22" height={34} />
            <CustomTextCard text="Média no Intervalo: 76%" height={34} />
          </ThemedView>

          <ThemedView
            mt="s"
            height="auto"
            backgroundColor="white"
            borderTopLeftRadius={20}
            borderTopRightRadius={20}
          >
            <ThemedView alignItems="center">
              <ThemedText color="black" fontWeight="bold" mt="m">
                Ranking Geral de Pontuação
              </ThemedText>
              <ThemedText color="gray" fontSize={12}>
                A pontuação é baseada no intervalo selecionado.
              </ThemedText>
            </ThemedView>

            <SwitchSelector
              options={[
                { label: "Alunos", value: "alunos" },
                { label: "Professores", value: "professores" },
              ]}
              onPress={(value: string) => setSelectedList(value)}
              initial={0}
              textColor={theme.colors.gray}
              selectedColor={theme.colors.white}
              buttonColor={theme.colors.gray}
              style={{ marginVertical: 10, marginHorizontal: 5 }}
            />

            {selectedList === "alunos" ? (
              <SectionList
                sections={DATA_STUDENTS}
                scrollEnabled={false}
                contentContainerStyle={{ gap: theme.spacing.s }}
                style={{ marginHorizontal: 10 }}
                renderItem={({ item, index }) => handleRenderItem(item, index)}
                renderSectionHeader={({ section: { title } }) => (
                  <ThemedText>{title}</ThemedText>
                )}
              />
            ) : (
              <FlatList
                data={DATA_TEACHERS}
                scrollEnabled={false}
                contentContainerStyle={{
                  gap: theme.spacing.s,
                  marginVertical: theme.spacing.s,
                  marginHorizontal: theme.spacing.s,
                }}
                renderItem={({ item, index }) => handleRenderItem(item, index)}
              />
            )}
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </ThemedView>
  );
}
