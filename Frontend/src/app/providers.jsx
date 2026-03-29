import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import About from "../pages/About/About";
import Contact from "../pages/About/Contact";
import SignupPage from "../pages/Auth/SignupPage";
import AppLayout from "../components/layout/AppLayout";
import LoginPage from "../pages/Auth/LoginPage";
import ProtectedRoute from "../components/layout/ProtectedRoute/ProtectedRoute";
import DashboardLayout from "../components/layout/Dashboardlayout";
import Dashboard from "../pages/Dashboard/MainDiv/DashboardFolder/Dashboard";
import EmployeeTab from "../pages/Dashboard/MainDiv/EmployeeTabFolder/EmployeeTab";
import RequestTab from "../pages/Dashboard/MainDiv/RequestTabFolder/RequestTab";

const Publicroutes = [
  {
    path: "/",
    element: (
      <>
        <AppLayout />
      </>
    ),
    children: [
      {
        index: true,
        element: (
          <>
            <HomePage />
            {/* <Features />
            <HowPeopleUse />
            <FeatureExplanation />
            <CTASection /> */}
          </>
        ),
      },
      {
        path: "about",
        element: (
          <>
            <About />
          </>
        ),
      },
      {
        path: "contact",
        element: (
          <>
            <Contact />
          </>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <>
        <LoginPage />
      </>
    ),
  },
  {
    path: "/signup",
    element: (
      <>
        <SignupPage />
      </>
    ),
  },
];

const Protectedroutes = [
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "all-employees",
        element: <EmployeeTab />,
      },
      {
        path: "approval-requests",
        element: <RequestTab />,
      },
      // {
      //   path: "folders/:folderId",
      //   element: <NotePage />,
      // },
      // {
      //   path: "folders/:id/note",
      //   element: <NotePage />,
      // },
      // {
      //   path: "links",
      //   element: <LinkPage />,
      // },
    ],
  },
  // {
  //   path: "/dashboard/note/:noteId/edit",
  //   element: <NoteEditorLayout />,
  // },
];

export const router = createBrowserRouter([
  ...Publicroutes,
  ...Protectedroutes,
]);