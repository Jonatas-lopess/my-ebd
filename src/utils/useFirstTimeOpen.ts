import StorageService from "@services/StorageService";
import { useState, useEffect } from "react";

export function useFirstTimeOpen() {
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkFirstTime() {
      try {
        const hasSeen = await StorageService.getItem("hasSeenIntro");

        setIsFirstTime(hasSeen === null);
      } catch (error) {
        console.error("Error checking first time:", error);
        setIsFirstTime(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkFirstTime();
  }, []);

  return { isFirstTime, isLoading };
}
