import React from "react";
import Header from "./2_component/1_header/Header";
import Body from "./2_component/2_body/Body";
import Footer from "./2_component/3_footer/Footer";
import { AuthProvider } from "./3_context/authContext";
import { LoadingProvider } from "./3_context/loadingContext";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { OpenProvider } from "./3_context/openContext";
import { QuizDataProvider } from "./3_context/quizDataContext";
import Login from "./Authentications/login/Login";
import MeetingForm from "./2_component/2_body/meeting/MeetNow";
import CreatedMeeting from "./2_component/2_body/meeting/CreatedMeeting";
import Meeting from "./2_component/2_body/meeting/Meeting";
import TechQuizChallenge from "./2_component/2_body/quiz/TechQuizForm/TechQuizChallenge";
import QuizComponent from "./2_component/2_body/quiz/QuizQnsAns";
import CodePlatform from "./2_component/2_body/quiz/Code_Platform/CodePlatform";
import DevDSAPracticeSheet from "./2_component/2_body/quiz/DSA_Sheet_Qns/DevDSASheet";
import Article from "./2_component/2_body/articleCard/Article";
import Profile from "./2_component/2_body/profile_post/Profiles";
import ProfileForm from "./2_component/2_body/profile_post/ProfileForm";
import Connections from "./2_component/2_body/profile_post/chats/connection/Connections";
import PrivateChat from "./2_component/2_body/profile_post/chats/private_chat/PrivateChat";
import Error from "./2_component/Errors/PageError";
import appStore from "./constantData/Stores/appStore";

const AppLayout = () => {
  return (
    <Provider store={appStore}>
      <AuthProvider>
        <OpenProvider>
          <LoadingProvider>
            <QuizDataProvider>
              <div>
                <Header />
                <Outlet />
                <Footer />
              </div>
            </QuizDataProvider>
          </LoadingProvider>
        </OpenProvider>
      </AuthProvider>
    </Provider>
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
        path: "/location/:lat/:lng",
        element: <Body />
      },
      {
        path: "/authentication/:id",
        element: <Login />,
      },
      {
        path: "/meetnow",
        element: <MeetingForm />,
      },
      {
        path: "/createdmeeting/:emailId/:nameId/:roomName",
        element: <CreatedMeeting />,
      },
      {
        path: "/meeting/:roomid/:username",
        element: <Meeting />,
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
        element: <CodePlatform />,
      },
      {
        path: "/dev-dsa-practice-sheet",
        element: <DevDSAPracticeSheet />,
      },
      {
        path: "/dev-article/:username",
        element: <Article />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/profile/:puid",
        element: <Profile />,
      },
      {
        path: "/profile-form",
        element: <ProfileForm />,
      },
      {
        path: "/connections",
        element: <Connections />,
      },
      {
        path: "/chat/:id",
        element: <PrivateChat />,
      },
    ],
    errorElement: <Error />,
  },
]);

export const App = () => <RouterProvider router={AppRouter} />;

export default App;
