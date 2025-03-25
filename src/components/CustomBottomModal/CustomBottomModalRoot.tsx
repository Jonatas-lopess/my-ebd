import { forwardRef } from "react";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

type CustomBottomModalRootProps = {
  children: React.ReactNode;
};

const CustomBottomModalRoot = forwardRef<
  BottomSheetModal,
  CustomBottomModalRootProps
>((props, ref) => {
  const { children } = props;

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal ref={ref} enableDismissOnClose>
        <BottomSheetView>{children}</BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
});

export default CustomBottomModalRoot;
