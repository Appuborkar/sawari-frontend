import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Loader from "./Loader";
import { Outlet } from "react-router-dom";

const Layout = ({ loading, loaderMessage }) => {
  return loading ? (
    <Loader message={loaderMessage || "Loading..."} />
  ) : (
    <>
      <Navbar />
        <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
