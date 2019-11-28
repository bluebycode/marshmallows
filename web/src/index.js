import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "./assets/vendor/nucleo/css/nucleo.css";
import "./assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/scss/argon-dashboard-react.scss";
import "./assets/scss/marshmallows/marshmallows.scss";

import AdminLayout from "./layouts/Admin.jsx";
import AuthLayout from "./layouts/Auth.jsx";

import { NotificationContainer } from 'react-notifications';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/cloud" render={props => <AdminLayout {...props} />} />
      <Route path="/auth" render={props => <AuthLayout {...props} />} />
      <Redirect from="/" to="/cloud/dashboard" />
    </Switch>
  </BrowserRouter>
,
  document.getElementById("root")
);
