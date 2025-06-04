import { forwardRef } from "react";
import {
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

type CustomBottomModalRootProps = BottomSheetModalProps & {
  children: React.ReactNode | ((data: any) => React.ReactNode);
};

const CustomBottomModalRoot = forwardRef<
  BottomSheetModal,
  CustomBottomModalRootProps
>(({ children, ...props }, ref) => {
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal ref={ref} enableDismissOnClose {...props}>
        {({ data }) => (
          <BottomSheetView>
            <>{typeof children === "function" ? children(data) : children}</>
          </BottomSheetView>
        )}
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
});

export default CustomBottomModalRoot;
