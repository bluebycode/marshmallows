
import Devices from "./views/Devices.jsx";
import Login from "./views/auth/Login.jsx";
import Register from "./views/auth/Register.jsx";
import TotpRegister from "./views/auth/Totp.jsx";
import Distributions from "./views/Distributions.jsx";
import Dashboard from "./views/Dashboard.jsx";
import Gateways from "./views/Gateways.jsx";

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
    path: "/gateway/all",
    name: "Gateways",
    icon: "ni ni-mobile-button text-primary",
    component: Gateways,
    visible: true,
    layout: "/cloud"
  },
  {
    path: "/gateway/add",
    name: "AddGateway",
    icon: "ni ni-mobile-button text-primary",
    component: Gateways,
    visible: false,
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
];
export default routes;
