import { createContext } from "react";

interface SelectedCourseContextInterface {
  selectedCourse: string | null;
  setSelectedCourse: (newValue: string) => void;
}

export const SelectedCourseContext =
  createContext<SelectedCourseContextInterface>({
    selectedCourse: null,
    setSelectedCourse: () => undefined,
  });
