import React from "react";
import Header from "./2_component/1_header/Header";
import Body from "./2_component/2_body/Body";
import Footer from "./2_component/3_footer/Footer";
import { AuthProvider } from "./3_context/authContext";
import { LoadingProvider } from "./3_context/loadingContext";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Login from "./Authentications/Login";
import Error from "./2_component/Errors/PageError";
import { Provider } from "react-redux";
import appStore from "./constantData/Stores/appStore";
import MeetingForm from "./2_component/2_body/meeting/MeetNow";
import CreatedMeeting from "./2_component/2_body/meeting/CreatedMeeting";
import Meeting from "./2_component/2_body/meeting/Meeting";
import { MeetRecordingProvider } from "./3_context/meetRecordingContext";
import QuizComponent from "./2_component/2_body/quiz/QuizQnsAns";
import TechQuizChallenge from "./2_component/2_body/quiz/TechQuizForm/TechQuizChallenge";
import { QuizDataProvider } from "./3_context/quizDataContext";
import CodePlatform from "./2_component/2_body/quiz/Code_Platform/CodePlatform";
import DevDSAPracticeSheet from "./2_component/2_body/quiz/DSA_Sheet_Qns/DevDSASheet";

const AppLayout = () => {
  return (
    <AuthProvider>
      <MeetRecordingProvider>
        <LoadingProvider>
          <QuizDataProvider>
            <Provider store={appStore}>
              <div>
                <Header />
                <Outlet />
                <Footer />
              </div>
            </Provider>
          </QuizDataProvider>
        </LoadingProvider>
      </MeetRecordingProvider>
    </AuthProvider>
  );
};

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Body />,
      },
      {
        path: "/authentication/:id",
        element: <Login />,
      },
      {
        path: "/meetnow",
        element: <MeetingForm />
      },
      {
        path: "/createdmeeting/:emailId/:nameId",
        element: <CreatedMeeting />
      },
      {
        path: "/meeting/:roomid/:username",
        element: <Meeting />
      },
      {
        path: "/devquizform",
        element: <TechQuizChallenge />,
      },
      {
        path: "/devquiz",
        element: <QuizComponent />,
      },
      {
        path: "/devleetCode",
        element: <CodePlatform />
      },
      {
        path: "/dev-dsa-practice-sheet",
        element: <DevDSAPracticeSheet />
      }
    ],
    errorElement: <Error />,
  },
]);

export const App = () => <RouterProvider router={AppRouter} />;

export default App;
