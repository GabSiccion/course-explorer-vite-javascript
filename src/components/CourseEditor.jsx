import { SelectedCourseContext } from "../helper/SelectedCourseContext";
import { useContext, useEffect, useState, useRef } from "react";
import {
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  addDoc,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "../config/Firebase";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

export function CourseEditor() {
  const tracksWrapper = useRef(null);

  const { selectedCourse, setSelectedCourse } = useContext(
    SelectedCourseContext
  );
  const [courseData, setCourseData] = useState({});
  const [courseTracksState, setCourseTracksState] = useState([]);

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

  function addTopic(e) {
    let index = e.target.getAttribute("trackindex");
    let track = document.getElementsByClassName("course-track")[index];

    const topicTemplate = () => {
      return (
        <div className="track-topic-container col-6">
          <p className="label fs-6">Topic {index}</p>
          <p
            suppressContentEditableWarning={true}
            contentEditable="true"
            className="topic-name border border-white rounded p-2 mb-2"
          >
            Topic Title
          </p>
          <p
            suppressContentEditableWarning={true}
            contentEditable="true"
            className="topic-text border border-white rounded p-2 mb-2"
          >
            Topic Text
          </p>
          <p
            suppressContentEditableWarning={true}
            contentEditable="true"
            className="topic-link border border-white rounded p-2 mb-2"
          >
            Topic URL
          </p>
        </div>
      );
    };
    track.append(topicTemplate());
  }

  function addCareer(e) {
    let index = e.target.getAttribute("trackindex");
    let track = document.getElementsByClassName("course-track")[index];
  }

  function addTrack() {
    const trackTemplate = [
      {
        trackName: "New Course Track",
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
    ];
    setCourseTracksState((courseTracksState) => [
      ...courseTracksState,
      ...trackTemplate,
    ]);
    console.log(courseTracksState);
    console.log();
  }

  function removeTrack(e) {
    let index = e.target.getAttribute("trackindex");
    let newTracksArray = [...courseTracksState];
    newTracksArray.splice(index - 1, 1);
    setCourseTracksState(newTracksArray.slice());
  }

  useEffect(() => {
    const getCourseData = async () => {
      const courseData = await getDoc(doc(db, "courses", selectedCourse));
      if (courseData.data != undefined) {
        setCourseData(courseData);
        setCourseTracksState(courseData.get("courseTracks"));
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
    let courseTracks = courseTracksState.map((track, trackindex) => {
      let trackTopics = track["trackTopics"];
      trackTopics = trackTopics.map((topic, index) => {
        return (
          <div className="track-topic-container col-6">
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
          <div className="track-career-container col-6">
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
          <p className="mt-4 fs-4 label">Track {trackindex + 1}</p>
          <div className="my-2">
            <Button
              variant="success"
              className="me-1"
              trackindex={trackindex}
              onClick={(e) => {
                addTopic(e);
              }}
            >
              Add Topic
            </Button>
            <Button
              variant="success"
              className="me-1"
              trackindex={trackindex}
              onClick={(e) => {
                addCareer(e);
              }}
            >
              Add Career
            </Button>
            <Button
              variant="danger"
              className="me-1"
              trackindex={trackindex}
              onClick={(e) => {
                removeTrack(e);
              }}
            >
              Delete Track
            </Button>
          </div>
          <p
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
            <div className="topic-list-container row">{trackTopics}</div>
          </div>
          <p className="fs-4 label">Track careers</p>
          <div className="careers-list-container row">{trackCareers}</div>
        </div>
      );
    });

    return (
      <>
        <div className="row mt-4 mb-4">
          <Button className="col-2 m-2" variant="success" onClick={addTrack}>
            Add Track
          </Button>
          <Button
            className="col-2 m-2"
            variant="success"
            onClick={updateTracks}
          >
            Update Course
          </Button>
          <Button className="col-2 m-2" variant="danger" onClick={deleteCourse}>
            Delete Course
          </Button>
        </div>
        <div className="course-content-wrapper">
          <div className="course-content-header">
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
        </div>
      </>
    );
  }
}
