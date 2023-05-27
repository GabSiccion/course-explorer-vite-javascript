import { TopBar } from "./components/TopBar";
import { LoginContext } from "./helper/LoginContext";
import { useEffect, useState } from "react";
import { auth, coursesCollectionRef } from "./config/firebase";
import { getDocs, collection, onSnapshot, doc } from "firebase/firestore";
import "./App.css";

function isLoggedIn() {
  if (auth.currentUser) {
    return true;
  } else {
    return false;
  }
}

function App() {
  useEffect(() => {
    const getCourseList = async () => {
      try {
        const data = await getDocs(coursesCollectionRef);
        const courses = data.docs.map((doc) => ({
          courseName: doc.get("courseName"),
          id: doc.id,
        }));
        console.log(courses);
        setCourseList(courses);
      } catch (err) {
        console.error(err);
      }
    };

    getCourseList();
    console.log(courseList);
  }, []);

  const [courseList, setCourseList] = useState([]);
  const [loginStatus, setLoginStatus] = useState(isLoggedIn());

  return (
    <LoginContext.Provider value={{ loginStatus, setLoginStatus }}>
      <div>
        <TopBar />
      </div>
    </LoginContext.Provider>
  );
}

export default App;
