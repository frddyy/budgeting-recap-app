// import
import Dashboard from "views/Dashboard/Dashboard";
import Tables from "views/Dashboard/Tables";
import Billing from "views/Dashboard/Billing";
import Wallets from "views/Dashboard/Wallets";
import SignIn from "views/Auth/SignIn.js";
import SignUp from "views/Auth/SignUp.js";
import Income from "views/Dashboard/Income";
import Expense from "views/Dashboard/Expense";
import Budgeting from "views/Dashboard/Budgeting";

import {
  HomeIcon,
  StatsIcon,
  CreditIcon,
  PersonIcon,
  DocumentIcon,
  RocketIcon,
  SupportIcon,
} from "components/Icons/Icons";

import { FaWallet as WalletIcon } from "react-icons/fa";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color="inherit" />,
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Tables",
    rtlName: "لوحة القيادة",
    icon: <StatsIcon color="inherit" />,
    component: Tables,
    layout: "/admin",
  },
  {
    path: "/billing",
    name: "Billing",
    rtlName: "لوحة القيادة",
    icon: <CreditIcon color="inherit" />,
    component: Billing,
    layout: "/admin",
  },
  {
    path: "/wallets",
    name: "Wallets",
    rtlName: "لوحة القيادة",
    icon: <WalletIcon color="inherit" />,
    component: Wallets,
    layout: "/admin",
  },
    path: "/income",
    name: "Income",
    rtlName: "لوحة القيادة",
    icon: <CreditIcon color="inherit" />,
    component: Income,
    layout: "/admin",
  },
  {
    path: "/expense",
    name: "Expense",
    rtlName: "لوحة القيادة",
    icon: <CreditIcon color="inherit" />,
    component: Expense,
    layout: "/admin",
  },
  {
    path: "/budgeting",
    name: "Budgeting",
    rtlName: "لوحة القيادة",
    icon: <WalletIcon color="inherit" />,
    component: Budgeting,
    layout: "/admin",
  },
];
export default dashRoutes;
