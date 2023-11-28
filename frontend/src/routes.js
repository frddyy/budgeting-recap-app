// import
import Dashboard from "views/Dashboard/Dashboard";
import Tables from "views/Dashboard/Tables";
import Billing from "views/Dashboard/Billing";
import Wallets from "views/Dashboard/Wallets";
import SignIn from "views/Auth/SignIn.js";
import SignUp from "views/Auth/SignUp.js";
import Incomes from "views/Dashboard/Incomes";
import Expenses from "views/Dashboard/Expenses";
import Budgeting from "views/Dashboard/Budgeting";
import Budgets from "views/Dashboard/Budgeting/Budgets";

import {
  HomeIcon,
  StatsIcon,
  CreditIcon,
  PersonIcon,
  DocumentIcon,
  RocketIcon,
  SupportIcon,
} from "components/Icons/Icons";

import { FaWallet as WalletIcon } from "react-icons/fa6";
import { FaSackDollar as BudgetIcon } from "react-icons/fa6";
import { GiPayMoney as ExpenseIcon } from "react-icons/gi";
import { GiReceiveMoney as IncomeIcon } from "react-icons/gi";

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
  {
    path: "/budgeting",
    name: "Budgeting",
    rtlName: "لوحة القيادة",
    icon: <BudgetIcon color="inherit" />,
    component: Budgeting,
    layout: "/admin",
  },
  {
    path: "/budgets/:category",
    name: "Budgets",
    rtlName: "لوحة القيادة",
    icon: <BudgetIcon color="inherit" />,
    component: Budgets,
    layout: "/admin",
    hidden: true
  },
  {
    path: "/incomes",
    name: "Incomes",
    rtlName: "لوحة القيادة",
    icon: <IncomeIcon color="inherit" />,
    component: Incomes,
    layout: "/admin",
  },
  {
    path: "/expenses",
    name: "Expenses",
    rtlName: "لوحة القيادة",
    icon: <ExpenseIcon color="inherit" />,
    component: Expenses,
    layout: "/admin",
  },
  {
    path: "/signin",
    name: "Sign In",
    rtlName: "لوحة القيادة",
    icon: <DocumentIcon color="inherit" />,
    component: SignIn,
    layout: "/auth",
    hidden: true,
  },
  {
    path: "/signup",
    name: "Sign Up",
    rtlName: "لوحة القيادة",
    icon: <RocketIcon color="inherit" />,
    secondaryNavbar: true,
    component: SignUp,
    layout: "/auth",
    hidden: true,
  },
];

export default dashRoutes;
