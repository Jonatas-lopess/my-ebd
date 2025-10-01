import { forwardRef } from "react";
import {
  BottomSheetModal,
  BottomSheetModalProps,
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
    <BottomSheetModal ref={ref} enableDismissOnClose {...props}>
      {({ data }) => (
        <BottomSheetView>
          <>{typeof children === "function" ? children(data) : children}</>
        </BottomSheetView>
      )}
    </BottomSheetModal>
  );
});

export default CustomBottomModalRoot;
