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
  const pie = () => {
    let courseScores = [];
    scores.map((score) => {
      if (score["course"] === "Information Technology") {
        courseScores.push(score["recommendation"]);
      }
    });
    let coursetracks = courseScores.filter(function (item, pos) {
      return courseScores.indexOf(item) == pos;
    });

    console.log(coursetracks);
    console.log(courseScores);

    let distribution = [];
    coursetracks.map((track, index) => {
      let instances = 0;
      courseScores.map((scoreTrack) => {
        if (track === scoreTrack) instances++;
      });
      distribution[index] = instances;
    });

    console.log(distribution);

    const distributionData = {
      labels: coursetracks,
      datasets: [
        {
          label: "Distribution of track recommendation",
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
    };
    return distributionData;
  };

  return (
    <div className="container mt-4">
      <Pie data={pie()} />
    </div>
  );
}
