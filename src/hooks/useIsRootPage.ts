import { useIonRouter } from "@ionic/react";

/**
 * Custom hook to detect if the user is on the root page
 * Returns true when the user is at the first page in the navigation stack
 * Used to trigger native swipe-back behavior
 */
export function useIsRootPage(): boolean {
  const ionRouter = useIonRouter();

  // Check if we can go back in the Ionic navigation stack
  // If canGoBack is false, we're at the root page
  const isRoot = !ionRouter.canGoBack();

  return isRoot;
}
