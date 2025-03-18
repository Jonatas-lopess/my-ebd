import { RootTabParamList } from "../../App";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
