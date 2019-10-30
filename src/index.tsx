import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Home } from "./components/Home";
import { Checkout } from "./components/Checkout";
import { Layout } from "./components/Layout";
import { Router } from "@reach/router";

ReactDOM.render(
  <Layout>
    <Router>
      <Home path="/" />
      <Checkout path="/checkout" />
    </Router>
  </Layout>,
  document.getElementById("root")
);
