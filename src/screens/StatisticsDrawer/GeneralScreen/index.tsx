import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useTheme } from "@shopify/restyle";
import { useCallback, useEffect, useState } from "react";
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
import { Rollcall } from "@screens/LessonStack/type";
import { _Class } from "@screens/ClassStack/ClassScreen/type";

export default function GeneralScreen() {
  const theme = useTheme<ThemeProps>();
  const navigation = useNavigation();
  const { token } = useAuth().authState;
  const [selectedList, setSelectedList] = useState("alunos");
  const [interval, setInterval] =
    useState<IntervalOptionTypes>("Últimas 13 aulas");

  const { data, error, isError, isPending } = useQuery({
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
  });

  const { data: classes, isPending: isClassesPending } = useQuery({
    queryKey: ["altclass"],
    queryFn: async (): Promise<_Class[]> => {
      const res = await fetch(config.apiBaseUrl + "/classes", {
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
    select: (data) => data.map((item) => item.name),
  });

  const { data: rollcalls, isPending: isRollcallsPending } = useQuery({
    queryKey: ["rollcalls"],
    queryFn: async (): Promise<Rollcall[]> => {
      const response = await fetch(`${config.apiBaseUrl}/rollcalls`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const resJson = await response.json();
      if (!response.ok)
        throw new Error(resJson.message, { cause: resJson.error });

      return resJson;
    },
  });

  useEffect(() => {
    if (error) console.log(error?.cause);
  }, [error]);

  function filterRollcallByInterval(
    data: Rollcall[],
    interval: IntervalOptionTypes
  ) {
    return data.filter((item) => {
      const lessonDate = new Date(item.lesson.date);
      const currentDate = new Date();
      const daysDifference = Math.ceil(
        (currentDate.getTime() - lessonDate.getTime()) / (1000 * 3600 * 24)
      );

      switch (interval) {
        case "Últimas 13 aulas":
          return daysDifference <= 90; // Approx. 3 months
        case "1º Trimestre":
          return lessonDate.getMonth() < 3; // January to March
        case "2º Trimestre":
          return lessonDate.getMonth() >= 3 && lessonDate.getMonth() < 6; // April to June
        default:
          return true;
      }
    });
  }

  const generateStudentList = useCallback((): {
    title: string;
    data: DataType[];
  }[] => {
    if (!rollcalls || !data) return [];

    const filteredRollcalls = filterRollcallByInterval(
      rollcalls,
      "Últimas 13 aulas"
    );
    const sections: { title: string; data: DataType[] }[] =
      classes?.map((className) => ({
        title: className,
        data: [],
      })) || [];

    data.forEach((register) => {
      if (register.user) return;

      const section = sections.find((sec) => sec.title === register.class.name);

      if (section && !section.data.some((s) => s.id === register._id)) {
        section.data.push({
          id: register._id,
          name: register.name,
          points: filteredRollcalls.reduce((total, rollcall) => {
            if (rollcall.register.id === register._id) {
              return total + (rollcall.isPresent ? 1 : 0);
            }

            return total;
          }, 0),
        });
      }
    });

    return sections;
  }, [data, rollcalls]);

  const generateTeacherList = useCallback((): DataType[] => {
    if (!data || !rollcalls) return [];

    const filteredRollcalls = filterRollcallByInterval(
      rollcalls,
      "Últimas 13 aulas"
    );

    return data
      .filter((register) => register.user)
      .map<DataType>((register): DataType => {
        const points = filteredRollcalls.reduce((total, rollcall) => {
          if (rollcall.register.id === register._id) {
            return total + (rollcall.isPresent ? 1 : 0);
          }
          return total;
        }, 0);

        return {
          id: register._id,
          name: register.name,
          points,
        };
      });
  }, [data, rollcalls]);

  const DATA_STUDENTS = generateStudentList();
  const DATA_TEACHERS = generateTeacherList();

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
        <ThemedText fontSize={16}>{item.name}</ThemedText>
        <ThemedText>{item.points}</ThemedText>
      </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedView flex={1} backgroundColor="secondary" pt="safeArea">
      <FocusAwareStatusBar style="light" translucent />

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

      <ScrollView nestedScrollEnabled contentContainerStyle={{ flexGrow: 1 }}>
        <ThemedView flexDirection="column" alignItems="center" mt="m">
          <ThemedText variant="h1" color="white">
            Escola Bíblica
          </ThemedText>
          <ThemedText variant="body" color="white">
            Vila Mury
          </ThemedText>
        </ThemedView>

        <ThemedView mt="m">
          <IntervalControl interval={interval} onCardPress={handleCardPress} />
        </ThemedView>

        <ThemedView flexDirection="row" mt="xl" justifyContent="space-around">
          <CustomTextCard
            text={
              "Matriculados: " +
              (DATA_STUDENTS.reduce(
                (acc, item) => acc + (item.data.length || 0),
                0
              ) || 0)
            }
            height={34}
          />
          <CustomTextCard text="Média no Intervalo: -" height={34} />
        </ThemedView>

        <ThemedView
          mt="s"
          height="auto"
          flex={1}
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
          {(isPending || isRollcallsPending || isClassesPending) && (
            <ThemedView>
              <ThemedText>Carregando...</ThemedText>
            </ThemedView>
          )}
          {isError && (
            <ThemedView>
              <ThemedText>Erro ao carregar dados...</ThemedText>
            </ThemedView>
          )}
          {!isPending &&
            !isRollcallsPending &&
            !isError &&
            !isClassesPending &&
            (selectedList === "alunos" ? (
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
            ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
