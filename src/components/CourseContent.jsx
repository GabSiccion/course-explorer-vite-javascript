import "../index.css";
import { CourseSelection } from "./CourseSelection";
import { SelectedCourseContext } from "../helper/SelectedCourseContext";
import { useState } from "react";
import { CourseEditor } from "./CourseEditor";

export function CourseContent() {
  const [selectedCourse, setSelectedCourse] = useState("");
  return (
    <SelectedCourseContext.Provider
      value={{ selectedCourse, setSelectedCourse }}
    >
      <div className="page-container">
        <div>
          <CourseSelection />
        </div>
        <div class="container">
          <CourseEditor />
        </div>
      </div>
    </SelectedCourseContext.Provider>
  );
}
