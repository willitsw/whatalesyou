import React from "react";
import * as ReactDOM from "react-dom";

import App from "./App";

import "./global-styles.css";
import "antd/dist/reset.css";

const mountNode = document.getElementById("root");

ReactDOM.render(<App />, mountNode);
