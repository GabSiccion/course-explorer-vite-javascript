import { SelectedCourseContext } from "../helper/SelectedCourseContext";
import { useContext, useEffect, useState, useRef } from "react";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/Firebase";
import "bootstrap/dist/css/bootstrap.min.css";

export function QuizEditor() {
  const tracksWrapper = useRef(null);

  const { selectedCourse, setSelectedCourse } = useContext(
    SelectedCourseContext
  );

  const [quizData, setQuizData] = useState([]);

  useEffect(() => {
    const getCourseData = async () => {
      const courseData = await getDoc(doc(db, "courses", selectedCourse));
      if (courseData.data != undefined) {
        let data = courseData.get("courseQuestions").slice();
        setQuizData([...data]);
      } else {
        console.log("no data");
      }
    };
    getCourseData();
  }, [selectedCourse]);

  if (quizData.length === 0 || selectedCourse === "") {
    return (
      <>
        <div className="course-content-wrapper mt-4">
          <p className="course-name fs-1">Select a course to edit.</p>
        </div>
      </>
    );
  } else {
    let questionsArray = quizData.map((question, index) => {
      return (
        <div className="question-container col-xs mb-4">
          <p className="label fs-4">Question {index + 1}:</p>
          <p
            contentEditable="true"
            suppressContentEditableWarning="true"
            className="question fs-4"
          >
            {question["question"]}
          </p>
          <div className="choices-container fs-5">
            <div className="row">
              <p className="col-1">A:</p>
              <p
                contentEditable="true"
                suppressContentEditableWarning={true}
                className="col-6"
              >
                {question["choices"]["a"]}
              </p>
            </div>
            <div className="row">
              <p className="col-1">B:</p>
              <p
                contentEditable="true"
                suppressContentEditableWarning={true}
                className="col-6"
              >
                {question["choices"]["b"]}
              </p>
            </div>
            <div className="row">
              <p className="col-1">C:</p>
              <p
                contentEditable="true"
                suppressContentEditableWarning={true}
                className="col-6"
              >
                {question["choices"]["c"]}
              </p>
            </div>
            <div className="row">
              <p className="col-1">D:</p>
              <p
                contentEditable="true"
                suppressContentEditableWarning={true}
                className="col-6"
              >
                {question["choices"]["d"]}
              </p>
            </div>
          </div>
        </div>
      );
    });

    return <div className="mt-4 row">{questionsArray}</div>;
  }
}
