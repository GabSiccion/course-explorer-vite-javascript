import "./CourseSelection.css";
import { db, auth, coursesCollectionRef } from "../config/firebase";
import { onSnapshot } from "firebase/firestore";
import { addDoc } from "firebase/firestore";
import { useState, useEffect, useContext } from "react";
import { SelectedCourseContext } from "../helper/SelectedCourseContext";

const addCourse = async (courseName) => {
  try {
    await addDoc(coursesCollectionRef, {
      courseName: courseName,
    });
  } catch (error) {
    console.error(error);
  }
};

export function CourseSelection() {
  const { selectedCourse, setSelectedCourse } = useContext(
    SelectedCourseContext
  );

  const selectCourse = (e) => {
    setSelectedCourse(e.target.getAttribute("course-key"));
  };

  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    const getCourseList = async () => {
      try {
        onSnapshot(coursesCollectionRef, (doc) => {
          const data = doc.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setCourseList(data);
        });
      } catch (error) {
        console.error(error);
      }
    };
    getCourseList();
  }, []);

  const courseButtons = () =>
    courseList.map((course) => {
      const { courseName, id } = course;
      return (
        <button
          type="button"
          key={id}
          course-key={id}
          value={courseName}
          onClick={(e) => selectCourse(e)}
        >
          {courseName}
        </button>
      );
    });

  return (
    <div className="course-selection-container">
      {courseButtons()}
      <button type="button" onClick={() => addCourse("New Course")}>
        +
      </button>
    </div>
  );
}
