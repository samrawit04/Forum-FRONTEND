import axios from "axios";
import { useContext, useEffect,useState} from "react";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import { UserContext } from "./context/UserContext";
import Home from "./pages/Home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import Question from "./pages/Question/Question";
import Answer from "./pages/Answer/Answer"

function App() {
  const [userData, setUserData] = useContext(UserContext);
const [isLoggedInChecked, setIsLoggedInChecked] = useState(false);

  //check if token already exists in localStorage
    let token = localStorage.getItem("auth-token");

  

  useEffect(() => {
    // Function to check if the user is logged in
    const checkLoggedIn = async () => {
      // Your logic to check if the user is logged in
      // ...const checkLoggedIn = async () => {

      if (!token || token === null) {
        //token not in localStorage then set auth token empty
        // localStorage.setItem("auth-token", "");
        // console.log("there is no token app js")
      } else {
        // console.log("there is token in app js")
        //if token exists in localStorage then use auth to verify token and get user info
        const userRes = await axios.get(
          `${process.env.REACT_APP_base_url}/api/users`,
          {
            headers: { "x-auth-token": token },
          }
        );

        console.log(userRes);
        //set the global state with user info
        console.log(userData);
        setUserData({
          token,
          user: {
            id: userRes.data.data.user_id,
            display_name: userRes.data.data.user_name,
          },
        });
        setIsLoggedInChecked(true);
      }
    };

    // For example, if the user is logged in, update the state accordingly
    // setIsLoggedInChecked(true);

    // Only call checkLoggedIn if it hasn't been executed yet
    if (!isLoggedInChecked) {
      checkLoggedIn();
    }
    // eslint-disable-next-line
  }, [isLoggedInChecked]); 


  const logout = () => {
    //set global state to undefined will logout the user
    setUserData({
      // eslint-disable-next-line
      token: undefined,
      user: undefined,
    });
    //resetting localStorage
    localStorage.setItem("auth-token", "");
  };

  // useEffect(() => {
  //   //check if the user is logged in
  //   checkLoggedIn();
  // }, []);


  return (
    <Router>
      <div>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home logout={logout} />} />
          <Route path="/askQuestion" element={<Question logout={logout} />} />
          <Route
            path="/answer/:post_id"
            element={<Answer logout={logout} />}
          />
          {/* <Route path="/test/:id" element={<Test />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
