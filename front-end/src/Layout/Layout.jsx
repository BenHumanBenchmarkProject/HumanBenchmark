import React from "react";
import "./Layout.css";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { useLoading } from "../loadingContext";
import LoadingIcon from "../LoadingIcon/LoadingIcon";

const Layout = ({ children }) => {
  const { loading } = useLoading();
  return (
    <div className="layout-container">
      <Header />
      <div className="content-wrapper">
        <Sidebar />
        <main className="layout-main-content">{children}</main>
        {loading && <LoadingIcon />}
      </div>
    </div>
  );
};

export default Layout;
