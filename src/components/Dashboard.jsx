import "../index.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { collection, getDocs, queryEqual } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, auth, coursesCollectionRef } from "../config/Firebase";
import { getCountFromServer, query, where } from "firebase/firestore";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function Dashboard() {
  const [courseList, setCourseList] = useState([]);
  const [scores, setScores] = useState([]);

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

      querySnapshot.forEach((doc) => {
        courseArray.push(doc.get("courseName"));
      });
      setCourseList(courseArray.slice());
    }
    getCourses();

    async function getScores() {
      let scoresArray = [];
      const querySnapshot = await getDocs(collection(db, "scores"));
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        scoresArray.push(doc.data());
      });
      setScores(scoresArray.slice());
    }
    getScores();
  }, []);

  //DISTRIBUTION CHART
  let pies = courseList.map((course) => {
    let courseScores = [];
    scores.map((score) => {
      if (score["course"] === course) {
        courseScores.push(score["recommendation"]);
      }
    });
    let coursetracks = courseScores.filter(function (item, pos) {
      return courseScores.indexOf(item) == pos;
    });

    let distribution = [];
    coursetracks.map((track, index) => {
      let instances = 0;
      courseScores.map((scoreTrack) => {
        if (track === scoreTrack) instances++;
      });
      distribution[index] = instances;
    });

    const distributionData = {
      labels: coursetracks,
      datasets: [
        {
          label: `Recommedation Distribution of ${course}`,
          data: distribution,
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 206, 86)",
            "rgb(75, 192, 192)",
            "rgb(153, 102, 255)",
            "rgb(255, 159, 64)",
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 206, 86)",
            "rgb(75, 192, 192)",
            "rgb(153, 102, 255)",
            "rgb(255, 159, 64)",
          ],
          borderWidth: 1,
        },
      ],
      options: {
        legend: {
          labels: {
            fontColor: "white",
          },
        },
      },
    };
    return (
      <div className="col-5">
        <Pie data={distributionData} />
      </div>
    );
  });

  //AVERAGE SCORE CHART
  let averageScores = courseList.map((course) => {
    let instances = 0;
    let totalScore = 0;
    scores.map((score) => {
      if (score["course"] === course) {
        instances++;
        totalScore = totalScore + score["score"];
      }
    });
    let average = Math.round(totalScore / instances);
    return (
      <div className="col-3 flex-column text-center average-score-container">
        <h1>%{average}</h1>
        <h1>{course}</h1>
      </div>
    );
  });

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <h2 className="text-center">Distribution of track recommendation</h2>
      </div>
      <div className="row justify-content-center pie-charts-container pb-4">
        {pies}
      </div>
      <div className="row justify-content-center">
        <h2 className="text-center mt-5">Average Scores on course quiz</h2>
      </div>
      <div className="row justify-content-center mt-4">{averageScores}</div>
    </div>
  );
}
