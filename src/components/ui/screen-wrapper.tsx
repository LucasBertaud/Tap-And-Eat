import { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: ReactNode;
  className?: string;
  edges?: Array<"top" | "bottom" | "left" | "right">;
}

/**
 * ScreenWrapper - Wrapper avec SafeAreaView pour toutes les vues
 * Gère automatiquement les zones sûres
 */
export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  className = "flex-1",
  edges = ["top", "left", "right"],
}) => {
  return (
    <SafeAreaView className={className} edges={edges}>
      {children}
    </SafeAreaView>
  );
};
