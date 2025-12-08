import CustomBottomModalAction from "./CustomBottomModalAction";
import CustomBottomModalContent from "./CustomBottomModalContent";
import CustomBottomModalRoot from "./CustomBottomModalRoot";

export const CustomBottomModal = {
  Root: CustomBottomModalRoot,
  Content: CustomBottomModalContent,
  Action: CustomBottomModalAction,
};

export type BottomSheetEventType<T = unknown> =
  | {
      type: "set";
      value: T;
    }
  | {
      value?: never;
      type: "open" | "close";
    };
