import { db, auth, coursesCollectionRef } from "../config/Firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { addDoc } from "firebase/firestore";
import { useState, useEffect, useContext } from "react";
import { SelectedCourseContext } from "../helper/SelectedCourseContext";
import { Button, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export function CourseSelection() {
  const { selectedCourse, setSelectedCourse } = useContext(
    SelectedCourseContext
  );

  const addCourse = async (courseName) => {
    try {
      await addDoc(coursesCollectionRef, {
        courseName: courseName,
        courseTexts: "course text goes here",
        courseTracks: [
          {
            trackName: "Course Track 1",
            trackText: "track text",
            trackTopics: [
              {
                topicName: "Topic name 1",
                topicText: "sample topic text",
                topicURL: "sample URL",
              },
              {
                topicName: "Topic name 2",
                topicText: "sample topic text",
                topicURL: "sample URL",
              },
              {
                topicName: "Topic name 3",
                topicText: "sample topic text",
                topicURL: "sample URL",
              },
              {
                topicName: "Topic name 4",
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
              {
                careerName: "career name sample",
                careerText: "career text sample",
                careerSalary: "$1000",
              },
            ],
          },
          {
            trackName: "Course Track 2",
            trackText: "track text",
            trackTopics: [
              {
                topicName: "Topic name 1",
                topicText: "sample topic text",
                topicURL: "sample URL",
              },
              {
                topicName: "Topic name 2",
                topicText: "sample topic text",
                topicURL: "sample URL",
              },
              {
                topicName: "Topic name 3",
                topicText: "sample topic text",
                topicURL: "sample URL",
              },
              {
                topicName: "Topic name 4",
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

  const courseButtons = () =>
    courseList.map((course) => {
      const { courseName, id } = course;
      return (
        <Button
          className="col-2"
          variant="success"
          type="button"
          key={id}
          course-key={id}
          value={courseName}
          onClick={(e) => selectCourse(e)}
        >
          {courseName ? courseName : "No name"}
        </Button>
      );
    });

  return (
    <Container>
      <div className="course-selection-container mt-4 row">
        {courseButtons()}
        <Button
          className="col-1"
          variant="success"
          type="button"
          onClick={() => addCourse("New Course")}
        >
          +
        </Button>
      </div>
    </Container>
  );
}
