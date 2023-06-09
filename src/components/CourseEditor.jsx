import { SelectedCourseContext } from "../helper/SelectedCourseContext";
import { useContext, useEffect, useState, useRef } from "react";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/Firebase";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Button, Card, Col, Row, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export function CourseEditor() {
  const tracksWrapper = useRef(null);

  const { selectedCourse, setSelectedCourse } = useContext(
    SelectedCourseContext
  );
  const [courseData, setCourseData] = useState({});

  const updateCourseName = async (e) => {
    updateDoc(doc(db, "courses", selectedCourse), {
      courseName: e.target.textContent,
    });
  };

  const updateCourseText = async (e) => {
    updateDoc(doc(db, "courses", selectedCourse), {
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

  async function updateTracks() {
    const getTracks = () => {
      let trackObjects = [];
      const tracks = Array.from(tracksWrapper.current.children);
      tracks.map((track) => {
        let trackName = track.getElementsByClassName("track-name")[0].innerText;
        let trackText = track.getElementsByClassName("track-text")[0].innerText;

        let trackCareersArray = Array.from(
          track.getElementsByClassName("track-career-container")
        );
        let trackCareers = trackCareersArray.map((career) => {
          let careerName =
            career.getElementsByClassName("career-name")[0].innerText;
          let careerText =
            career.getElementsByClassName("career-text")[0].innerText;
          let careerSalary =
            career.getElementsByClassName("career-salary")[0].innerText;
          return {
            careerName: careerName,
            careerText: careerText,
            careerSalary: careerSalary,
          };
        });

        let trackTopicsArray = Array.from(
          track.getElementsByClassName("track-topic-container")
        );
        let trackTopics = trackTopicsArray.map((topic) => {
          let topicName =
            topic.getElementsByClassName("topic-name")[0].innerText;
          let topicText =
            topic.getElementsByClassName("topic-text")[0].innerText;
          let topicURL =
            topic.getElementsByClassName("topic-link")[0].innerText;
          return {
            topicName: topicName,
            topicText: topicText,
            topicURL: topicURL,
          };
        });

        let object = {
          trackName: trackName,
          trackText: trackText,
          trackCareers: trackCareers,
          trackTopics: trackTopics,
        };
        trackObjects.push(object);
      });
      return trackObjects;
    };

    if (auth.currentUser.emailVerified) {
      updateDoc(doc(db, "courses", selectedCourse), {
        courseTracks: getTracks(),
      });
    } else {
      alert("Save prevented, your email has not yet been verified.");
    }
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
          <div className="topic-container col-6">
            <p className="label fs-6">Topic {index + 1}</p>
            <p
              suppressContentEditableWarning={true}
              contentEditable="true"
              className="topic-name border border-white rounded p-2 mb-2"
            >
              {topic["topicName"]}
            </p>
            <p
              suppressContentEditableWarning={true}
              contentEditable="true"
              className="topic-text border border-white rounded p-2 mb-2"
            >
              {topic["topicText"]}
            </p>
            <p
              suppressContentEditableWarning={true}
              contentEditable="true"
              className="topic-link border border-white rounded p-2 mb-2"
            >
              {topic["topicURL"]}
            </p>
          </div>
        );
      });

      let trackCareers = track["trackCareers"];
      trackCareers = trackCareers.map((career, index) => {
        return (
          <div className="track-career-container">
            <p className="label fs-6">Career {index + 1}</p>
            <p
              suppressContentEditableWarning={true}
              contentEditable="true"
              className="career-name border border-white rounded p-2 mb-2"
            >
              {career["careerName"]}
            </p>
            <p
              suppressContentEditableWarning={true}
              contentEditable="true"
              className="career-text border border-white rounded p-2 mb-2"
            >
              {career["careerText"]}
            </p>
            <p
              suppressContentEditableWarning={true}
              contentEditable="true"
              className="career-salary border border-white rounded p-2 mb-2"
            >
              {career["careerSalary"]}
            </p>
          </div>
        );
      });

      return (
        <div className="course-track">
          <p className="mt-4 fs-4 label">Track {trackIndex + 1}</p>
          <p
            class=""
            suppressContentEditableWarning={true}
            contentEditable="true"
            className="track-name border border-white rounded p-2 mb-2"
          >
            {track["trackName"]}
          </p>
          <p
            suppressContentEditableWarning={true}
            contentEditable="true"
            className="track-text border border-white rounded p-2 mb-2"
          >
            {track["trackText"]}
          </p>

          <div className="tracks-list-container">
            <p className="label fs-4">Tracks topics</p>
            <div className="row">{trackTopics}</div>
          </div>
          <p className="fs-4 label">Track careers</p>
          <div className="careers-list-container">{trackCareers}</div>
        </div>
      );
    });

    return (
      <>
        <div className="course-content-wrapper">
          <div className="course-content-header mt-4">
            <p className="label fs-4">Course Name</p>
            <p
              suppressContentEditableWarning={true}
              contentEditable="true"
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
              suppressContentEditableWarning={true}
              contentEditable="true"
              onKeyDown={(e) => tryToPreventNewLines(e)}
              onBlur={(e) => updateCourseText(e)}
            >
              {courseData.get("courseTexts")}
            </p>
          </div>
          <div className="course-tracks-wrapper" ref={tracksWrapper}>
            {courseTracks}
          </div>
          <div className="row mt-4 mb-4">
            <Button
              className="col-2 m-2"
              variant="success"
              onClick={updateTracks}
            >
              Update Course
            </Button>
            <Button
              className="col-2 m-2"
              variant="warning"
              onClick={deleteCourse}
            >
              Delete Course
            </Button>
          </div>
          <div></div>
        </div>
      </>
    );
  }
}
