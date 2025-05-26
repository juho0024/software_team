import "./bootstrap.min.css";
import "./index.css";
import { useEffect, useState, useCallback } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Header from "./components/header/header";
import { Footer } from "./components/footer/footer";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation,
  useNavigate
} from "react-router-dom";
import { CreateSurvey } from "./components/surveyComponents/createSurvey";
import { DisplaySurvey } from "./components/surveyComponents/displaySurvey";
import { DisplaySurveyList } from "./components/surveyComponents/displaySurveyList";
import { SurveySubmit } from "./components/surveyComponents/surveySubmit";
import { Splash } from "./pages/splash";
import { DisplayResults } from './components/surveyComponents/displayResults';
import { NotFound } from './pages/notfound';
import {serverUrl} from "./variables/constants.js";


function BasicLayout() {
  return (
    <>
      <Header />
      
        <Outlet />
     
      

      <Footer />
    </>
  );
}

function DisplaySurveyLayout() {
  return (
      <>
        <Header />
        <Outlet />
        <Footer />
      </>
  );
}

function App() {
  const { isAuthenticated, getAccessTokenSilently, isLoading, login } =
    useAuth0();
  const [userData, setUserData] = useState(null);
  const [currentSurveyId, setCurrentSurveyId] = useState(null);
  const [error, setError] = useState(false);

  const loginOrCreateUser = useCallback(async (user) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${serverUrl}/users/login`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          _id: user.sub,
        }),
      });

      const responseData = await response.json();

      setUserData(responseData);
      console.log(userData);
    } catch (error) {
      console.log(error);
      setError({ error: error.error });
    }
  });

  const sendSurveyId = (id) => {
    setCurrentSurveyId(id);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<BasicLayout />} >
          <Route index element={<Splash />} />
          <Route
          path="dashboard"
          element={
            
           <DisplaySurveyList
              id={userData !== null && userData._id}
              loginOrCreateUser={loginOrCreateUser}
              sendSurveyId={sendSurveyId} />
            
            
          }
        />
          <Route
          path="create-survey/*"
          element={
            <PrivateView
            component={CreateSurvey}
              id={userData !== null && userData._id}
              surveyId={currentSurveyId}
              sendSurveyId={sendSurveyId}
            />
            
          }
        />
          <Route
          path="create-survey/:id/*"
          element={
            <PrivateView
            component={CreateSurvey}
              id={userData !== null && userData._id}
              surveyId={currentSurveyId}
              sendSurveyId={sendSurveyId}
            />
          }
        />
        <Route
          path="display-results/:id/*"
          element={
            <PrivateView
            component={DisplayResults} />
           
          }
        />
         <Route path="*" element={<NotFound />} />
        </Route>
    <Route path="/display-survey" element={<DisplaySurveyLayout />} >
        <Route
          path=":id"
          element={
            <DisplaySurvey
              id={userData !== null && userData._id}
              surveyId={currentSurveyId}
              sendSurveyId={sendSurveyId}
            />
          }
        />

        <Route path="submit-survey/:id" element={<SurveySubmit />} />
        </Route>
      </Routes>
    </>
  );
}


function PrivateView({ component, ...propsForComponent }) {
  const { isAuthenticated, loginWithRedirect} = useAuth0();
  let location = useLocation();
  let navigate = useNavigate();

  const Navigate = withAuthenticationRequired(component);

  return <Navigate {...propsForComponent} />;
}

export default App;
