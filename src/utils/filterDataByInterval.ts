import { IntervalCustomObj, IntervalMonthlyObj, IntervalObj, IntervalQuarterlyObj } from "@components/IntervalControl";
import { Alert } from "react-native";

export default function fn<T>(data: Array<T>, interval?: IntervalObj): Array<T> {
    if (!interval || !interval.object) return data;

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
          let date = undefined;
          
          if ("date" in (item as object)) { date = new Date((item as { date: string | Date }).date) }
           else { date = new Date((item as { lesson: { date: string | Date } }).lesson.date) };

          const month = date.getMonth();
          const time = date.getTime();
    
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