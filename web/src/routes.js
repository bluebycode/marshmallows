
//import Devices from "./views/Devices.jsx";
import Login from "./views/auth/Login.jsx";
import Register from "./views/auth/Register.jsx";
import TotpRegister from "./views/auth/Totp.jsx";
import Distributions from "./views/Distributions.jsx";
import Dashboard from "./views/Dashboard.jsx";
import Assign from "./views/auth/Assign.jsx";
import Devices from "./views/Devices.jsx";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Dashboard,
    visible: true,
    layout: "/cloud"
  },
  {
    path: "/devices",
    name: "Devices",
    icon: "ni ni-map-big text-primary",
    component: Devices,
    visible: true,
    layout: "/cloud"
  },
  {
    path: "/distributions",
    name: "Distributions",
    icon: "ni ni-app text-orange",
    visible: true,
    component: Distributions,
    layout: "/cloud"
  },
  {
    path: "/login",
    name: "Login",
    visible: false,
    icon: "ni ni-cloud-download-95 text-blue",
    component: Login,
    layout: "/auth"
  },
  {
    path: "/register",
    name: "Register",
    visible: false,
    icon: "ni ni-cloud-download-95 text-blue",
    component: Register,
    layout: "/auth"
  },
  {
    path: "/totp",
    name: "Totp",
    visible: false,
    icon: "ni ni-cloud-download-95 text-blue",
    component: TotpRegister,
    layout: "/auth"
  },
  {
    path: "/assign",
    name: "Token",
    visible: false,
    icon: "ni ni-cloud-download-95 text-blue",
    component: Assign,
    layout: "/auth"
  },
];
export default routes;
