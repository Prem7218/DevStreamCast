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

const AppLayout = () => {
  return (
    <AuthProvider>
      <LoadingProvider>
        <Provider store={appStore}>
          <div>
            <Header />
            <Outlet />
            <Footer />
          </div>
        </Provider>
      </LoadingProvider>
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
      }
    ],
    errorElement: <Error />,
  },
]);

export const App = () => <RouterProvider router={AppRouter} />;

export default App;
