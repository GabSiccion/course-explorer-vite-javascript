import "./CourseContent.css";
import { SelectedCourseContext } from "../helper/SelectedCourseContext";
import { useContext, useEffect, useState } from "react";
import { findDOMNode } from "react-dom";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export function CourseContent() {
  const { selectedCourse, setSelectedCourse } = useContext(
    SelectedCourseContext
  );
  const [courseData, setCourseData] = useState({});

  const updateCourseName = async (e) => {
    console.log(e.target.textContent);
    await updateDoc(doc(db, "courses", selectedCourse), {
      courseName: e.target.textContent,
    });
  };

  async function deleteCourse() {
    try {
      await deleteDoc(doc(db, "courses", selectedCourse));
      setSelectedCourse("");
    } catch (error) {
      console.error(error);
    }
  }

  function tryToPreventNewLines(e) {
    switch (e.keyCode) {
      case 13:
        e.preventDefault();
        e.blur();
        return false;
    }
    return true;
  }

  useEffect(() => {
    const getCourseData = async () => {
      const courseData = await getDoc(doc(db, "courses", selectedCourse));
      if (courseData.data != undefined) {
        setCourseData(courseData);
      } else {
        console.log("no data");
      }
    };
    getCourseData();
  }, [selectedCourse]);

  if (Object.keys(courseData).length === 0 || selectedCourse === "") {
    return (
      <>
        <div className="course-content-wrapper">
          <span className="course-name">Select a course to edit.</span>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="course-content-wrapper">
          <p>
            <span
              suppressContentEditableWarning={true}
              className="course-name"
              contentEditable="true"
              onBlur={(e) => updateCourseName(e)}
              onKeyDown={(e) => tryToPreventNewLines(e)}
            >
              {courseData.get("courseName")}
            </span>
            <span
              className="delete-course-button"
              onClick={() => deleteCourse()}
            >
              x
            </span>
          </p>
        </div>
      </>
    );
  }
}
