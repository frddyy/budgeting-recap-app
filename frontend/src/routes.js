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
import TransactionLog from "views/Dashboard/TransactionLog";
import Profile from "views/Dashboard/Profile";


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
import { BiSolidReport as LogIcon } from "react-icons/bi";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <HomeIcon color="inherit" />,
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Tables",
    icon: <StatsIcon color="inherit" />,
    component: Tables,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/billing",
    name: "Billing",
    icon: <CreditIcon color="inherit" />,
    component: Billing,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/wallets",
    name: "Wallets",
    icon: <WalletIcon color="inherit" />,
    component: Wallets,
    layout: "/admin",
  },
  {
    path: "/budgeting",
    name: "Budgeting",
    icon: <BudgetIcon color="inherit" />,
    component: Budgeting,
    layout: "/admin",
  },
  {
    path: "/budgets/:category",
    name: "Budgets",
    icon: <BudgetIcon color="inherit" />,
    component: Budgets,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/incomes",
    name: "Incomes",
    icon: <IncomeIcon color="inherit" />,
    component: Incomes,
    layout: "/admin",
  },
  {
    path: "/expenses",
    name: "Expenses",
    icon: <ExpenseIcon color="inherit" />,
    component: Expenses,
    layout: "/admin",
  },
  {
    path: "/log",
    name: "Transaction Log",
    rtlName: "لوحة القيادة",
    icon: <LogIcon color="inherit" />,
    component: TransactionLog,
    layout: "/admin",
  },
  {
    path: "/profile",
    name: "Profile",
    icon: <LogIcon color="inherit" />,
    component: Profile,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/signin",
    name: "Sign In",
    icon: <DocumentIcon color="inherit" />,
    component: SignIn,
    layout: "/auth",
    hidden: true,
  },
  {
    path: "/signup",
    name: "Sign Up",
    icon: <RocketIcon color="inherit" />,
    secondaryNavbar: true,
    component: SignUp,
    layout: "/auth",
    hidden: true,
  },
];

export default dashRoutes;
