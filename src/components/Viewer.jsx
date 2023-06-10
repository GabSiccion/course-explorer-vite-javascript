import "../index.css";
import { CourseSelection } from "./CourseSelection";
import { SelectedCourseContext } from "../helper/SelectedCourseContext";
import { useState } from "react";
import { ViewerContent } from "./ViewerContent";

export function Viewer() {
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
          <ViewerContent />
        </div>
      </div>
    </SelectedCourseContext.Provider>
  );
}
