import "./CourseSelection.css";
import { db, auth, coursesCollectionRef } from "../config/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { addDoc } from "firebase/firestore";
import { useState, useEffect, useContext } from "react";
import { SelectedCourseContext } from "../helper/SelectedCourseContext";

export function CourseSelection() {
  const { selectedCourse, setSelectedCourse } = useContext(
    SelectedCourseContext
  );

  const addCourse = async (courseName) => {
    try {
      await addDoc(coursesCollectionRef, {
        courseName: courseName,
        courseTexts: ["Course Text placeholder"],
        courseTracks: [
          {
            trackName: "sample track",
            trackText: "track text",
            trackTopics: [
              {
                topicName: "sample topic name",
                topicText: "sample topic text",
                topicURL: "sample URL",
              },
            ],
            trackCareers: [
              {
                careerName: "career name sample",
                careerText: "career text sample",
                careerSalary: "$1000",
              },
            ],
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };

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

  useEffect(() => {
    console.log(selectedCourse);
  }, [selectedCourse]);

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
          {courseName ? courseName : "No name"}
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
