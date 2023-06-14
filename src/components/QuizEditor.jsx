import { SelectedCourseContext } from "../helper/SelectedCourseContext";
import { useContext, useEffect, useState, useRef } from "react";
import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  setDoc,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "../config/Firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";

function getQuiz() {
  let questionsObjects = [];

  const questionContainers =
    document.getElementsByClassName("question-container");

  let questionContainerArray = Array.from(questionContainers);
  questionContainerArray.map((questionContainer) => {
    let question =
      questionContainer.getElementsByClassName("question")[0].textContent;
    let choiceA =
      questionContainer.getElementsByClassName("choice-a")[0].textContent;
    let choiceB =
      questionContainer.getElementsByClassName("choice-b")[0].textContent;
    let choiceC =
      questionContainer.getElementsByClassName("choice-c")[0].textContent;
    let choiceD =
      questionContainer.getElementsByClassName("choice-d")[0].textContent;
    let correctLetter =
      questionContainer.getElementsByClassName("correct-letter")[0].textContent;
    let track =
      questionContainer.getElementsByClassName("track")[0].textContent;

    let choicesObject = { a: choiceA, b: choiceB, c: choiceC, d: choiceD };

    questionsObjects.push({
      question: question,
      choices: choicesObject,
      correctchoice: correctLetter,
      track: track,
    });
  });

  return questionsObjects;
}

export function QuizEditor() {
  const tracksWrapper = useRef(null);

  const { selectedCourse, setSelectedCourse } = useContext(
    SelectedCourseContext
  );

  const [quizData, setQuizData] = useState([]);
  const [render, setRender] = useState(true);

  const updateQuiz = async () => {
    if (auth.currentUser.emailVerified) {
      await updateDoc(doc(db, "courses", selectedCourse), {
        courseQuestions: getQuiz(),
      }).then(alert("saved"));
    } else {
      alert("Save prevented, your email has not yet been verified.");
    }
  };

  async function addQuestion() {
    const questionTemplate = {
      choices: {
        a: "choice a",
        b: "choice b",
        c: "choice c",
        d: "choice d",
      },
      correctchoice: "a",
      question: "new question to be answered",
      track: "track of the question",
    };

    setQuizData((quizData) => [...quizData, questionTemplate]);
  }

  function removeQuestion(e) {
    let index = e.target.getAttribute("questionIndex");
    let questionsArrayCopy = [...quizData];
    questionsArrayCopy.splice(index, 1);
    setQuizData(questionsArrayCopy);
  }

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
        <div
          className="question-container col-xs mb-4"
          key={`${index}question-container`}
        >
          <p className="label fs-5">Question {index + 1}:</p>
          <Button
            className="my-1"
            variant="danger"
            questionIndex={index}
            onClick={(e) => {
              removeQuestion(e);
            }}
          >
            Remove question
          </Button>
          <p
            contentEditable="true"
            suppressContentEditableWarning="true"
            className="question fs-5"
          >
            {question["question"]}
          </p>
          <div className="choices-container fs-5">
            <div className="row">
              <p className="col-3">choice a:</p>
              <p
                contentEditable="true"
                suppressContentEditableWarning={true}
                className="col-6 choice-a"
              >
                {question["choices"]["a"]}
              </p>
            </div>
            <div className="row">
              <p className="col-3">choice b:</p>
              <p
                contentEditable="true"
                suppressContentEditableWarning={true}
                className="col-6 choice-b"
              >
                {question["choices"]["b"]}
              </p>
            </div>
            <div className="row">
              <p className="col-3">choice c:</p>
              <p
                contentEditable="true"
                suppressContentEditableWarning={true}
                className="col-6 choice-c"
              >
                {question["choices"]["c"]}
              </p>
            </div>
            <div className="row">
              <p className="col-3">choice d:</p>
              <p
                contentEditable="true"
                suppressContentEditableWarning={true}
                className="col-6 choice-d"
              >
                {question["choices"]["d"]}
              </p>
            </div>
            <div className="row">
              <p className="col-3">Correct Answer:</p>
              <p
                contentEditable="true"
                suppressContentEditableWarning={true}
                className="col-6 correct-letter"
              >
                {question["correctchoice"]}
              </p>
            </div>
            <div className="row">
              <p className="col-3">track:</p>
              <p
                contentEditable="true"
                suppressContentEditableWarning={true}
                className="col-6 track"
              >
                {question["track"]}
              </p>
            </div>
          </div>
        </div>
      );
    });

    return (
      <>
        <div className="row mt-4 mb-4">
          <Button className="col-2 m-2" variant="success" onClick={updateQuiz}>
            Update Course
          </Button>
          <Button className="col-2 m-2" variant="success" onClick={addQuestion}>
            Add Question
          </Button>
        </div>
        <div className="mt-4 row quiz-editor-container">{questionsArray}</div>
      </>
    );
  }
}
