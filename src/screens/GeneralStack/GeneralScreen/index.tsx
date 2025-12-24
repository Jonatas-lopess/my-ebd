import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@shopify/restyle";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  SectionList,
} from "react-native";
import SwitchSelector from "@components/SwitchSelector";
import CustomTextCard from "@components/CustomTextCard";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import IntervalControl, {
  IntervalCustomObj,
  IntervalLessonsObj,
  IntervalMonthlyObj,
  IntervalObj,
  IntervalQuarterlyObj,
} from "@components/IntervalControl";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { ThemeProps } from "@theme";
import { DataType } from "@screens/ClassStack/ClassDetails/type";
import { skipToken, useQuery } from "@tanstack/react-query";
import config from "config";
import { useAuth } from "@providers/AuthProvider";
import { Rollcall } from "@screens/LessonStack/type";
import { _Class } from "@screens/ClassStack/ClassScreen/type";
import { Asset } from "expo-asset";
import { readAsStringAsync } from "expo-file-system";
import { shareAsync } from "expo-sharing";
import { printToFileAsync } from "expo-print";
import { Score } from "@screens/ScoreOptions/type";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import report from "@assets/rankingReport.html";
import getRegisters from "api/getRegisters";

export default function GeneralScreen() {
  const theme = useTheme<ThemeProps>();
  const navigation = useNavigation();
  const { token, user } = useAuth().authState;
  const [selectedList, setSelectedList] = useState("alunos");
  const [isRendering, setIsRendering] = useState(false);
  const [interval, setInterval] = useState<IntervalObj | null>(null);
  const hasUser = user?.role === "teacher" ? false : undefined;
  const registerApiKey = user?.role === "teacher" ? ["register", false] : ["register"];

  const { data, error, isError, isPending, isRefetching, refetch } = useQuery({
    queryKey: registerApiKey,
    queryFn: () => getRegisters({ hasUser, token, _class: user?.register?.class }),
  });

  const { data: scores } = useQuery({
    queryKey: ["scores"],
    queryFn: async (): Promise<Score[]> => {
      const res = await fetch(config.apiBaseUrl + "/scores", {
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

  async function getClasses(): Promise<_Class[]> {
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
  }

  const { data: classes, isLoading: isClassesLoading } = useQuery({
    queryKey: ["altclass"],
    queryFn:
      user?.role === "admin" || user?.role === "owner" ? getClasses : skipToken,
    select: (data) => data.map((item) => item.name),
  });

  async function getRollcalls(): Promise<Rollcall[]> {
    if (user === undefined) throw new Error("User is undefined");

    let response: Response;

    if (user.role === "teacher") {
      response = await fetch(
        `${config.apiBaseUrl}/rollcalls?class=${user.register?.class}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      response = await fetch(`${config.apiBaseUrl}/rollcalls`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    }

    const resJson = await response.json();
    if (!response.ok)
      throw new Error(resJson.message, { cause: resJson.error });

    return resJson;
  }

  const { data: rollcalls, isPending: isRollcallsPending } = useQuery({
    queryKey: ["rollcalls"],
    queryFn: getRollcalls,
  });

  function filterRollcallByInterval(
    data: Rollcall[],
    interval: IntervalObj | null
  ) {
    if (interval === null || interval.object === null) return data;

    const fromTime =
      (interval.object as IntervalCustomObj).initialDate?.getTime() ||
      undefined;
    const toTime =
      (interval.object as IntervalCustomObj).finalDate?.getTime() || undefined;
    const monthNames = new Map<number, string>([
      [0, "Janeiro"],
      [1, "Fevereiro"],
      [2, "Março"],
      [3, "Abril"],
      [4, "Maio"],
      [5, "Junho"],
      [6, "Julho"],
      [7, "Agosto"],
      [8, "Setembro"],
      [9, "Outubro"],
      [10, "Novembro"],
      [11, "Dezembro"],
    ]);

    if (interval.type === "Últimas X aulas") {
      Alert.alert(
        "Funcionalidade em construção! Você pode escolher outros intervalos enquanto isso..."
      );
      return data;
    }

    return data.filter((item) => {
      const lessonDate = new Date(item.lesson.date);
      const month = lessonDate.getMonth();
      const time = lessonDate.getTime();

      if (interval.type === "Mensal") {
        return (
          monthNames.get(month) ===
          (interval.object as IntervalMonthlyObj).month
        );
      }

      if (interval.type === "Trimestral") {
        switch ((interval.object as IntervalQuarterlyObj).quarter) {
          case "1º Trimestre":
            return month < 3; // January to March
          case "2º Trimestre":
            return month >= 3 && month < 6; // April to June
          case "3º Trimestre":
            return month >= 6 && month < 9; // July to September
          case "4º Trimestre":
            return month >= 9 && month < 12; // October to December
          default:
            return true;
        }
      }

      if (interval.type === "Intervalo Personalizado") {
        if (!fromTime || !toTime) return true;
        return time >= fromTime && time <= toTime;
      }
    });
  }

  function generateStudentList(): { title: string; data: DataType[] }[] {
    if (!rollcalls || !data || !classes || !scores) return [];

    const scoreWeightById = new Map<string, number>();
    scores.forEach((s) => scoreWeightById.set(s._id, s.weight));

    const filteredRollcalls = filterRollcallByInterval(rollcalls, interval);
    const rollcallsByRegister = new Map<string, Rollcall[]>();
    filteredRollcalls.forEach((r) => {
      const registerId = r.register.id;
      if (!rollcallsByRegister.has(registerId))
        rollcallsByRegister.set(registerId, []);

      rollcallsByRegister.get(registerId)!.push(r);
    });

    const sections = classes.map((className) => ({
      title: className,
      data: [] as DataType[],
    }));

    data.forEach((register) => {
      if (register.user) return;

      const section = sections.find((sec) => sec.title === register.class.name);

      if (!section)
        return console.log(
          "Error: generateStudentList register section not found."
        );
      if (section.data.some((s) => s.id === register._id)) return;

      const registerRollcalls = rollcallsByRegister.get(register._id) || [];
      const points = registerRollcalls.reduce((total, rollcall) => {
        const scoreSum = rollcall.score?.reduce((acc: number, curr) => {
          const weight = scoreWeightById.get(curr.scoreInfo) ?? 0;

          return acc + (weight && curr.value ? weight : 0);
        }, 0);

        return total + (scoreSum ?? (rollcall.isPresent ? 1 : 0));
      }, 0);

      section.data.push({ id: register._id, name: register.name, points });
      section.data.sort((a, b) => b.points - a.points);
    });

    return sections;
  }

  function generateTeacherList(): DataType[] {
    if (!data || !rollcalls || !scores || user?.role === "teacher") return [];

    const filteredRollcalls = filterRollcallByInterval(rollcalls, interval);
    const rollcallsByRegister = new Map<string, Rollcall[]>();

    filteredRollcalls.forEach((r) => {
      const registerId = r.register.id;
      if (!rollcallsByRegister.has(registerId))
        rollcallsByRegister.set(registerId, []);

      rollcallsByRegister.get(registerId)?.push(r);
    });

    const scoreWeightById = new Map<string, number>();
    scores.forEach((s) => scoreWeightById.set(s._id, s.weight));

    return data
      .filter((register) => register.user)
      .map<DataType>((register): DataType => {
        const regRollcalls = rollcallsByRegister.get(register._id) || [];
        const points = regRollcalls.reduce((total, rollcall) => {
          const scoreSum = rollcall.score?.reduce((acc: number, curr) => {
            const weight = scoreWeightById.get(curr.scoreInfo) ?? 0;

            return acc + (weight && curr.value ? weight : 0);
          }, 0);

          return total + (scoreSum ?? (rollcall.isPresent ? 1 : 0));
        }, 0);

        return { id: register._id, name: register.name, points };
      })
      .sort((a, b) => b.points - a.points);
  }

  const DATA_STUDENTS = useMemo(
    () => generateStudentList(),
    [data, rollcalls, classes, scores, interval]
  );
  const DATA_TEACHERS = useMemo(
    () => generateTeacherList(),
    [data, rollcalls, scores, interval]
  );

  const handleIntervalSelect = useCallback((newInterval: IntervalObj) => {
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

  function handleIntervalReplace() {
    if (interval === null || interval.object === null)
      return "Todos os períodos";

    if (interval.type === "Últimas X aulas") {
      return `Últimas ${
        (interval.object as IntervalLessonsObj).lessonsCount
      } aulas`;
    }

    if (interval.type === "Intervalo Personalizado") {
      const initialDate = (interval.object as IntervalCustomObj).initialDate;
      const finalDate = (interval.object as IntervalCustomObj).finalDate;

      return `${initialDate.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })} - ${finalDate.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })}`;
    }

    if (interval.type === "Mensal") {
      return (interval.object as IntervalMonthlyObj).month;
    }

    return (interval.object as IntervalQuarterlyObj).quarter;
  }

  async function printRanking() {
    setIsRendering(true);

    try {
      const asset = await Asset.fromModule(report).downloadAsync();
      let html = await readAsStringAsync(asset.localUri ?? "");

      html = html.replace("{{INTERVALO}}", handleIntervalReplace());
      html = html.replace(
        "{{PROFESSORES}}",
        DATA_TEACHERS.map((teacher, index) => {
          return `<tr><td>${index + 1}º</td><td>${teacher.name}</td><td>${
            teacher.points
          }</td></tr>`;
        }).join("")
      );
      html = html.replace(
        "{{CLASSES}}",
        DATA_STUDENTS.map((section) => {
          const sectionTitle = `<h4>${section.title}</h4><hr/>`;

          const sectionData = section.data
            .map((student, index) => {
              return `<tr><td>${index + 1}º</td><td>${student.name}</td><td>${
                student.points
              }</td></tr>`;
            })
            .join("");

          return (
            sectionTitle +
            '<table border="1" cellspacing="0" cellpadding="5" width="100%"  style="margin-bottom: 1rem;">' +
            "<tr><th>Posição</th>" +
            "<th>Nome</th>" +
            "<th>Total de Pontos</th></tr>" +
            sectionData +
            "</table>"
          );
        }).join("")
      );

      const { uri } = await printToFileAsync({ html });
      console.log("PDF generated at:", uri);

      setIsRendering(false);
      await shareAsync(uri, {
        UTI: "com.adobe.pdf",
        mimeType: "application/pdf",
      });
    } catch (error) {
      setIsRendering(false);
      console.log("Error exporting ranking:", error);
      Alert.alert("Erro", "Não foi possível exportar o ranking.");
    }
  }

  return (
    <BottomSheetModalProvider>
      <ThemedView flex={1} backgroundColor="secondary" pt="safeArea">
        <FocusAwareStatusBar style="light" translucent />
        <ThemedView flexDirection="row" mx="s" my="m" alignItems="center">
          <Ionicons.Button
            name="arrow-back"
            onPress={() => navigation.goBack()}
            size={25}
            backgroundColor="transparent"
            underlayColor="transparent"
            style={{ padding: 0 }}
            iconStyle={{ marginRight: 0 }}
          />
          <ThemedView flex={1} alignItems="center">
            <ThemedText color="white" variant="h1" fontWeight="bold">
              Ranque Geral
            </ThemedText>
          </ThemedView>
          <Ionicons.Button
            name="paper-plane-sharp"
            color={theme.colors.white}
            onPress={() =>
              Alert.alert("Exportar", "Deseja exportar o ranking como pdf?", [
                { text: "Cancelar", style: "cancel" },
                { text: "Sim", onPress: printRanking },
              ])
            }
            size={25}
            backgroundColor="transparent"
            underlayColor="transparent"
            style={{ padding: 0 }}
            iconStyle={{ marginRight: 0 }}
          />
        </ThemedView>

        <IntervalControl interval={interval} onSelect={handleIntervalSelect} />

        <ScrollView nestedScrollEnabled contentContainerStyle={{ flexGrow: 1 }}>
          <ThemedView flexDirection="row" mt="m" justifyContent="space-around">
            <CustomTextCard
              text={
                "Total de Alunos: " +
                (DATA_STUDENTS.reduce(
                  (acc, item) => acc + (item.data.length || 0),
                  0
                ) || 0)
              }
              height={34}
            />
            <CustomTextCard
              text={"Total de Professores: " + DATA_TEACHERS.length}
              height={34}
            />
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

            {user && (user.role === "admin" || user.role === "owner") && (
              <SwitchSelector
                options={["Alunos", "Professores"]}
                initialIndex={selectedList === "professores" ? 1 : 0}
                onChange={(_, value) => setSelectedList(value.toLowerCase())}
                containerStyle={{ paddingHorizontal: 5, marginVertical: 10 }}
              />
            )}

            {(isPending || isRollcallsPending || isClassesLoading) && (
              <ThemedView flex={1} alignItems="center" justifyContent="center">
                <ThemedText>Carregando...</ThemedText>
              </ThemedView>
            )}
            {isError && (
              console.log(error),
              <ThemedText textAlign="center" mt="s">Erro ao carregar dados...</ThemedText>
            )}
            {data && rollcalls && scores && (!isClassesLoading) && data.length === 0 && (
              <ThemedText textAlign="center" mt="s">Nenhum registro encontrado...</ThemedText>
            )}
            {!isPending &&
              !isRollcallsPending &&
              !isError &&
              !isClassesLoading &&
              (selectedList === "alunos" ? (
                <SectionList
                  sections={DATA_STUDENTS}
                  scrollEnabled={false}
                  contentContainerStyle={{ gap: theme.spacing.s }}
                  style={{ marginHorizontal: 10 }}
                  renderItem={({ item, index }) =>
                    handleRenderItem(item, index)
                  }
                  renderSectionHeader={({ section: { title } }) => (
                    <ThemedText>{title}</ThemedText>
                  )}
                  refreshControl={
                    <RefreshControl
                      refreshing={isRefetching}
                      onRefresh={refetch}
                    />
                  }
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
                  renderItem={({ item, index }) =>
                    handleRenderItem(item, index)
                  }
                  refreshControl={
                    <RefreshControl
                      refreshing={isRefetching}
                      onRefresh={refetch}
                    />
                  }
                />
              ))}
          </ThemedView>
        </ScrollView>

        <Modal visible={isRendering} transparent animationType="fade">
          <ThemedView flex={1} justifyContent="center" alignItems="center">
            <ThemedText>Exportando ranking...</ThemedText>
            <ActivityIndicator size="large" color="primary" />
          </ThemedView>
        </Modal>
      </ThemedView>
    </BottomSheetModalProvider>
  );
}
