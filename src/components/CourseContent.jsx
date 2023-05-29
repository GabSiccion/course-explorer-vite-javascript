import "./CourseContent.css";
import { SelectedCourseContext } from "../helper/SelectedCourseContext";
import { useContext, useEffect, useState } from "react";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/Firebase";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function CourseContent() {
  const { selectedCourse, setSelectedCourse } = useContext(
    SelectedCourseContext
  );
  const [courseData, setCourseData] = useState({});

  const updateCourseName = async (e) => {
    await updateDoc(doc(db, "courses", selectedCourse), {
      courseName: e.target.textContent,
    });
  };

  const updateCourseText = async (e) => {
    await updateDoc(doc(db, "courses", selectedCourse), {
      courseTexts: e.target.textContent,
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

  function updateCourse() {
    //get track children
    let tracksParentContainer = document.getElementsByClassName(
      "course-tracks-wrapper"
    );
    console.log(tracksParentContainer.childNodes);
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
    let courseTracks = courseData.get("courseTracks");
    courseTracks = courseTracks.map((track) => {
      let trackTopics = track["trackTopics"];
      trackTopics = trackTopics.map((topic) => {
        return (
          <div className="track-topic-container">
            <h4
              suppressContentEditableWarning={true}
              contentEditable="true"
              className="topic-name"
            >
              {topic["topicName"]}
            </h4>
            <p
              suppressContentEditableWarning={true}
              contentEditable="true"
              className="topic-text"
            >
              {topic["topicText"]}
            </p>
            <p
              suppressContentEditableWarning={true}
              contentEditable="true"
              className="topic-link"
            >
              {topic["topicURL"]}
            </p>
          </div>
        );
      });

      let trackCareers = track["trackCareers"];
      trackCareers = trackCareers.map((career) => {
        return (
          <div className="track-career-container">
            <p
              suppressContentEditableWarning={true}
              contentEditable="true"
              className="career-name"
            >
              {career["careerName"]}
            </p>
            <p
              suppressContentEditableWarning={true}
              contentEditable="true"
              className="career-text"
            >
              {career["careerText"]}
            </p>
            <p
              suppressContentEditableWarning={true}
              contentEditable="true"
              className="career-salary"
            >
              {career["careerSalary"]}
            </p>
          </div>
        );
      });

      return (
        <div className="course-track">
          <h3 suppressContentEditableWarning={true} contentEditable="true">
            {track["trackName"]}
          </h3>
          <p suppressContentEditableWarning={true} contentEditable="true">
            {track["trackText"]}
          </p>

          <div className="tracks-list-container">{trackTopics}</div>
          <div className="careers-list-container">{trackCareers}</div>
        </div>
      );
    });

    return (
      <>
        <div className="course-content-wrapper">
          <div className="course-content-header">
            <span
              suppressContentEditableWarning={true}
              contentEditable="true"
              className="course-d1"
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
          </div>
          <h2>Course Texts</h2>
          <div className="course-content-texts">
            <p
              suppressContentEditableWarning={true}
              contentEditable="true"
              onKeyDown={(e) => tryToPreventNewLines(e)}
              onBlur={(e) => updateCourseText(e)}
            >
              {courseData.get("courseTexts")}
            </p>
          </div>
          <h2>Course Tracks</h2>
          <div className="course-tracks-wrapper">{courseTracks}</div>
          <button className="update-course-button">Update</button>
        </div>
      </>
    );
  }
}
