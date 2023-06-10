import { SelectedCourseContext } from "../helper/SelectedCourseContext";
import { useContext, useEffect, useState, useRef } from "react";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import {db } from "../config/Firebase";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

export function ViewerContent() {
  const tracksWrapper = useRef(null);

  const { selectedCourse, setSelectedCourse } = useContext(
    SelectedCourseContext
  );
  const [courseData, setCourseData] = useState({});

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
        <div className="course-content-wrapper mt-4">
          <p className="course-name fs-1">Select a course to edit.</p>
        </div>
      </>
    );
  } else {
    let courseTracks = courseData.get("courseTracks");
    courseTracks = courseTracks.map((track, trackIndex) => {
      let trackTopics = track["trackTopics"];
      trackTopics = trackTopics.map((topic, index) => {
        return (
          <div className="track-topic-container col-6">
            <p className="label fs-6">Topic {index + 1}</p>
            <p className="topic-name border border-white rounded p-2 mb-2">
              {topic["topicName"]}
            </p>
            <p className="topic-text border border-white rounded p-2 mb-2">
              {topic["topicText"]}
            </p>
            <p className="topic-link border border-white rounded p-2 mb-2">
              {topic["topicURL"]}
            </p>
          </div>
        );
      });

      let trackCareers = track["trackCareers"];
      trackCareers = trackCareers.map((career, index) => {
        return (
          <div className="track-career-container col-6">
            <p className="label fs-6">Career {index + 1}</p>
            <p className="career-name border border-white rounded p-2 mb-2">
              {career["careerName"]}
            </p>
            <p className="career-text border border-white rounded p-2 mb-2">
              {career["careerText"]}
            </p>
            <p className="career-salary border border-white rounded p-2 mb-2">
              {career["careerSalary"]}
            </p>
          </div>
        );
      });

      return (
        <div className="course-track">
          <p className="mt-4 fs-4 label">Track {trackIndex + 1}</p>
          <p className="track-name border border-white rounded p-2 mb-2">
            {track["trackName"]}
          </p>
          <p className="track-text border border-white rounded p-2 mb-2">
            {track["trackText"]}
          </p>
          <div className="tracks-list-container">
            <p className="label fs-4">Tracks topics</p>
            <div className="topic-list-container row">{trackTopics}</div>
          </div>
          <p className="fs-4 label">Track careers</p>
          <div className="careers-list-container row">{trackCareers}</div>
        </div>
      );
    });

    return (
      <>
        <div className="course-content-wrapper">
          <div className="course-content-header mt-4">
            <p className="label fs-4">Course Name</p>
            <p
              className="border border-white rounded p-2 mb-2"
              onBlur={(e) => updateCourseName(e)}
              onKeyDown={(e) => tryToPreventNewLines(e)}
            >
              {courseData.get("courseName")}
            </p>
          </div>
          <p className="label fs-4">Course Text</p>
          <div className="course-content-texts border border-white rounded p-2 mb-2">
            <p
              onKeyDown={(e) => tryToPreventNewLines(e)}
              onBlur={(e) => updateCourseText(e)}
            >
              {courseData.get("courseTexts")}
            </p>
          </div>
          <div className="course-tracks-wrapper" ref={tracksWrapper}>
            {courseTracks}
          </div>
          <div className="row mt-4 mb-4"></div>
        </div>
      </>
    );
  }
}
