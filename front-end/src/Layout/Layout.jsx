import React from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Header />
      <div className="content-wrapper">
        <Sidebar />
        <main className="main-content">{children}</main>

      </div>
    </div>
  );
};

export default Layout;
