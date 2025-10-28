import { _Class } from "@screens/ClassStack/ClassScreen/type";
import { Lesson } from "@screens/LessonStack/LessonScreen/type";
import { Rollcall } from "@screens/LessonStack/type";
import { RegisterFromApi } from "@screens/RegisterStack/RegisterScreen/type";
import { Score } from "@screens/ScoreOptions/type";
import config from "config";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import { Alert } from "react-native";

type Props = {
  lessonInfo: Lesson | undefined;
  token: string;
  scoreInfo: Score[] | undefined;
  classes: _Class[] | undefined;
  data: RegisterFromApi[] | undefined;
  setIsRenderingReport: React.Dispatch<React.SetStateAction<boolean>>;
};

function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export async function printToFile({
  lessonInfo,
  token,
  scoreInfo,
  classes,
  data,
  setIsRenderingReport,
}: Props) {
  if (lessonInfo === undefined || lessonInfo.isFinished === undefined)
    return Alert.alert(
      "Erro",
      "Não foi possível gerar o relatório. A lição ainda está em aberto."
    );

  setIsRenderingReport(true);

  try {
    const report: Rollcall[] = await (
      await fetch(config.apiBaseUrl + `/rollcalls?lesson=${lessonInfo._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
    ).json();

    if (!report || report.length === 0) {
      setIsRenderingReport(false);
      Alert.alert("Erro", "Não foi possível gerar o relatório.");
      return console.log(report);
    }

    const html = `<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <title>Relatório de Chamada</title>
        <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        h2, h4, h5 {
            margin: 0;
            padding: 0;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        </style>
    </head>
    <body>
        <div style="text-align: center;text-transform: uppercase;margin-bottom: 2rem;">
          <h2>Lição Nº ${lessonInfo?.number} ${
      lessonInfo?.title ? "- " + lessonInfo?.title : ""
    }</h2>
          <h2>${formatDate(lessonInfo?.date ?? "")}</h2>
        </div>
        <div style="margin-bottom: 2rem;">
            <h4 style="text-transform: uppercase;">Relatório dos Professores</h4>
            <hr>
            <table border="1" cellspacing="0" cellpadding="5" width="100%">
                <tr>
                    <th>Professor</th>
                    <th>Classe</th>
                    ${
                      scoreInfo
                        ?.map((score) => `<th>${score.title}</th>`)
                        .join("") ?? ""
                    }
                    <th>Total</th>
                </tr>
                ${report
                  .map((rollcall) => {
                    let total = 0;
                    const scoresHtml =
                      scoreInfo
                        ?.map((score) => {
                          const reportItem = rollcall.score?.find(
                            (r) => r.scoreInfo === score._id
                          );

                          if (!reportItem) return `<td></td>`;
                          if (typeof reportItem.value === "number")
                            total += reportItem.value > 0 ? score.weight : 0;
                          else if (reportItem.value) total += score.weight;

                          return `<td>${
                            typeof reportItem.value === "number"
                              ? reportItem.value
                              : reportItem.value
                              ? "Sim"
                              : "Não"
                          }</td>`;
                        })
                        .join("") ?? "";

                    return `<tr>
                    <td>${
                      data?.find(
                        (teacher) => teacher._id === rollcall.register.id
                      )?.name ?? "Não encontrado"
                    }</td>
                    <td>${
                      classes?.find(
                        (cls) => cls._id === rollcall.register.class
                      )?.name ?? "Não encontrado"
                    }</td>
                    ${scoresHtml}
                    <td>${total}</td>
                </tr>`;
                  })
                  .join("")}
            </table>
        </div>
        <div>
            <h4 style="text-transform: uppercase;">Relatório dos Alunos</h4>
            <hr>
            ${classes
              ?.map((cls) => {
                const classRollcalls = report.filter(
                  (r) => r.register.class === cls._id
                );

                return `<h5>${cls.name}</h5>
              <table border="1" cellspacing="0" cellpadding="5" width="100%" style="margin-bottom: 0.5rem;">
                  <tr>
                      <th>Aluno</th>
                      ${
                        scoreInfo
                          ?.map((score) => `<th>${score.title}</th>`)
                          .join("") ?? ""
                      }
                  </tr>
                  ${classRollcalls
                    .map((rollcall) => {
                      const scoresHtml =
                        scoreInfo
                          ?.map((score) => {
                            const reportItem = rollcall.score?.find(
                              (r) => r.scoreInfo === score._id
                            );

                            return `<td>${
                              reportItem
                                ? typeof reportItem.value === "number"
                                  ? reportItem.value
                                  : reportItem.value
                                  ? "Sim"
                                  : "Não"
                                : ""
                            }</td>`;
                          })
                          .join("") ?? "";

                      return `<tr>
                          <td>${rollcall.register.name}</td>
                          ${scoresHtml}
                      </tr>`;
                    })
                    .join("")}
              </table>`;
              })
              .join("")}
        </div>
    </body>
    </html>`;

    const { uri } = await printToFileAsync({ html });
    console.log("File has been saved to:", uri);

    setIsRenderingReport(false);
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  } catch (error) {
    setIsRenderingReport(false);
    console.log(error);
    Alert.alert("Erro", "Não foi possível gerar o relatório.");
    return;
  }
}
