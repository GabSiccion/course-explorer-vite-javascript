import "../index.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, auth } from "../config/Firebase";
import { getCountFromServer, query, where } from "firebase/firestore";

export function Dashboard() {
  const [courseList, setCourseList] = useState([]);
  const [countList, setCountList] = useState([]);
  const [averageScores, setAverageScores] = useState([]);

  const scoresColl = collection(db, "scores");

  const getCount = async (courseName) => {
    const q = query(scoresColl, where("course", "==", `${courseName}`));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  };

  useEffect(() => {
    async function getCourses() {
      let courseArray = [];
      const querySnapshot = await getDocs(collection(db, "courses"));
      querySnapshot.forEach(async (doc) => {
        courseArray.push(doc.get("courseName"));
      });
      setCourseList(courseArray.slice());
    }
    getCourses();

    async function getCount2() {
      let countArray = [];
      courseList.map((courseName) => {
        getCount(courseName).then((value) => {
          countArray.push(value);
        });
      });
      setCountList(await countArray);
    }
    getCount2();
  }, []);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-6 d-flex flex-column justify-content-center">
          <h1>
            {countList.reduce(function (a, b) {
              return a + b;
            }, 0)}
          </h1>
          <p className="fs-4">Times the quiz has been answered.</p>
        </div>
        <div className="col-6"></div>
        <div className="col-6"></div>
      </div>
    </div>
  );
}
