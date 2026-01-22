import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import LoginPage from "../pages/LoginPage/LoginPage";
import HomePage from "../pages/HomePage/HomePage";
import Layout from "../components/Layout/Layout";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import MapPage from "../pages/MapPage";
import OperatorsPage from "../pages/OperatorsPage";
import Vehicles from "../pages/Vehicles";
import ServicePage from "../pages/ServicePage";
import WarningPage from "../pages/WarningPage";
import ReportPage from "../pages/ReportPage";
import NotificationPage from "../pages/NotificationPage";
import NotFoundPage from "../pages/ErrorPages/NotFoundPage";
import AccountPage from "../pages/AccountPage";
import VehicleDetail from "../pages/VehicleDetail";
import LayoutWrapper from "../components/Layout/LayoutWrapper";
import DocumentPage from "../pages/DocumentPage";
import ScrollToTop from "../components/ScrollToTop";
import SettingsPage from "../pages/SettingsPage";
import ResetPasswordPage from "../pages/ResetPasswordPage/ResetPasswordPage";

const Router = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/resetPassword" element={<ResetPasswordPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/vehicle_document/:id" element={<DocumentPage />} />
          <Route element={<LayoutWrapper />}></Route>

          <Route element={<Layout />}>
            <Route path="/vehicle/:id" element={<VehicleDetail />} />
            <Route index path="/home" element={<HomePage />} />
            <Route path="/Operators" element={<OperatorsPage />} />
            <Route path="/Vehicles" element={<Vehicles />} />
            <Route path="/Services" element={<ServicePage />} />
            <Route path="/Warning" element={<WarningPage />} />
            <Route path="/Map" element={<MapPage />} />
            <Route path="/Report" element={<ReportPage />} />
            <Route path="/Notification" element={<NotificationPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
