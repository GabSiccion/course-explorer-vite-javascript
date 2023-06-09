import "../index.css";
import { CourseSelection } from "./CourseSelection";
import { SelectedCourseContext } from "../helper/SelectedCourseContext";
import { useState } from "react";
import { QuizEditor } from "./QuizEditor";

export function QuizContent() {
  const [selectedCourse, setSelectedCourse] = useState("");
  return (
    <SelectedCourseContext.Provider
      value={{ selectedCourse, setSelectedCourse }}
    >
      <div className="page-container">
        <div>
          <CourseSelection />
        </div>
        <div className="container">
          <QuizEditor />
        </div>
      </div>
    </SelectedCourseContext.Provider>
  );
}
