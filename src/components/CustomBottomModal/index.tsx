import CustomBottomModalAction from "./CustomBottomModalAction";
import CustomBottomModalContent from "./CustomBottomModalContent";
import CustomBottomModalRoot from "./CustomBottomModalRoot";

export const CustomBottomModal = {
  Root: CustomBottomModalRoot,
  Content: CustomBottomModalContent,
  Action: CustomBottomModalAction,
};

export type BottomSheetEventType =
  | {
      type: "set";
      value: string;
    }
  | {
      value?: undefined;
      type: "open" | "close";
    };
