import "./bootstrap.min.css";
import "./index.css";
import { useState } from "react";
import Header from "./components/header/header";
import { Footer } from "./components/footer/footer";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Outlet,
    Navigate,
    useLocation
} from "react-router-dom";
import { CreateSurvey } from "./components/surveyComponents/createSurvey";
import { DisplaySurvey } from "./components/surveyComponents/displaySurvey";
import { DisplaySurveyList } from "./components/surveyComponents/displaySurveyList";
import SurveySubmit from './components/surveyComponents/surveySubmit';
import { Splash } from "./pages/splash";
import { DisplayResults } from './components/surveyComponents/displayResults';
import { NotFound } from './pages/notfound';
import Register from './pages/register';
import LoginForm from './pages/LoginForm';
import { useAuth } from "./hooks/AuthContext";

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
    const { user } = useAuth();
    const [currentSurveyId, setCurrentSurveyId] = useState(null);

    const sendSurveyId = (id) => {
        setCurrentSurveyId(id);
    };

    return (
        <Routes>
            <Route path="/" element={<BasicLayout />}>
                <Route index element={<Splash />} />
                <Route
                    path="dashboard"
                    element={<DisplaySurveyList sendSurveyId={sendSurveyId} />}
                />
                <Route
                    path="create-survey/*"
                    element={
                        <PrivateRoute>
                            <CreateSurvey surveyId={currentSurveyId} sendSurveyId={sendSurveyId} />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="create-survey/:id/*"
                    element={
                        <PrivateRoute>
                            <CreateSurvey surveyId={currentSurveyId} sendSurveyId={sendSurveyId} />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="display-results/:id/*"
                    element={
                        <PrivateRoute>
                            <DisplayResults />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/display-survey" element={<DisplaySurveyLayout />}>
                <Route
                    path=":id"
                    element={<DisplaySurvey surveyId={currentSurveyId} sendSurveyId={sendSurveyId} />}
                />
                <Route path="submit-survey/:id" element={<SurveySubmit />} />
            </Route>

            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
}

// ✅ 보호 라우트 처리
function PrivateRoute({ children }) {
    const { user } = useAuth();
    const location = useLocation();
    return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
}

export default App;
