import React from "react";
import { useEffect } from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import Home from "../views/home";
import About from "../views/about";
import Register from "../views/register";
import Login from "../views/login";
import Logout from "../views/logout";
import Menu from "../views/menu";
import Delivery from "../views/delivery";
import FranchiseDashboard from "../views/franchiseDashboard";
import History from "../views/history";
import AdminDashboard from "../views/adminDashboard";
import DinerDashboard from "../views/dinerDashboard";
import CreateStore from "../views/createStore";
import CreateFranchise from "../views/createFranchise";
import CloseFranchise from "../views/closeFranchise";
import CloseStore from "../views/closeStore";
import Payment from "../views/payment";
import NotFound from "../views/notFound";
import Docs from "../views/docs";
import Breadcrumb from "../components/breadcrumb";
import { pizzaService } from "../service/service";
import { Role, User } from "../service/pizzaService";
import "preline/preline";

declare global {
  interface Window {
    HSStaticMethods: any;
  }
}

/**
 * The layout of the App is a Header, a Breadcrumb, renders the Route View of the current navigation link, and finally a footer at the end
 */
export default function App() {
  const [user, setUser] = React.useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    (async () => {
      const user = await pizzaService.getUser();
      setUser(user);
    })();
  }, []);

  useEffect(() => {
    window.HSStaticMethods.autoInit();
    window.scrollTo(0, 0);
  }, [location.pathname]);

  /**
   * loggedIn returns the truthy value of user (meaning if user is not null, it returns true)
   * @returns boolean
   */
  function loggedIn() {
    return !!user;
  }
  /**
   * loggedOut returns the opposite of loggedIn (returns the truthy value of user)
   * @returns boolean
   */
  function loggedOut() {
    return !loggedIn();
  }
  /**
   * isAdmin checks to see if the user is an Admin
   * @returns boolean
   */
  function isAdmin() {
    return Role.isRole(user, Role.Admin);
  }
  /**
   * isNotAdmin returns the opposite of isAdmin (checks to see if the user is an Admin)
   * @returns boolean
   */
  function isNotAdmin() {
    return !isAdmin();
  }

  /**
   * All the possible navigation locations. `Title` is what it is called. `To` is the navigation link associated with
   *   that title. `Component` is what View it is will use and display information on the screen, such as Home directing
   *   to the Home View. `Constraints` show what boolean condition needs to be true in order for this navigation to be
   *   possible, such as Login and Register showing up if the user is not logged in, or Logout showing up if the user is
   *   logged in. `Display` means where it will appear (nav = shows up in the top right of the screen opposite of the
   *   JWT Pizza logo, footer = shows up in the footer)
   */
  const navItems = [
    { title: "Home", to: "/", component: <Home />, display: [] },
    {
      title: "Diner",
      to: "/diner-dashboard",
      component: <DinerDashboard user={user} setUser={setUser} />,
      display: [],
    },
    { title: "Order", to: "/menu", component: <Menu />, display: ["nav"] },
    {
      title: "Franchise",
      to: "/franchise-dashboard",
      component: <FranchiseDashboard user={user} />,
      constraints: [isNotAdmin],
      display: ["nav", "footer"],
    },
    { title: "About", to: "/about", component: <About />, display: ["footer"] },
    {
      title: "History",
      to: "/history",
      component: <History />,
      display: ["footer"],
    },
    {
      title: "Admin",
      to: "/admin-dashboard",
      component: <AdminDashboard user={user} />,
      constraints: [isAdmin],
      display: ["nav"],
    },
    {
      title: "Create franchise",
      to: "/:subPath?/create-franchise",
      component: <CreateFranchise />,
      display: [],
    },
    {
      title: "Close franchise",
      to: "/:subPath?/close-franchise",
      component: <CloseFranchise />,
      display: [],
    },
    {
      title: "Create store",
      to: "/:subPath?/create-store",
      component: <CreateStore />,
      display: [],
    },
    {
      title: "Close store",
      to: "/:subPath?/close-store",
      component: <CloseStore />,
      display: [],
    },
    { title: "Payment", to: "/payment", component: <Payment />, display: [] },
    {
      title: "Delivery",
      to: "/delivery",
      component: <Delivery />,
      display: [],
    },
    {
      title: "Login",
      to: "/:subPath?/login",
      component: <Login setUser={setUser} />,
      constraints: [loggedOut],
      display: ["nav"],
    },
    {
      title: "Register",
      to: "/:subPath?/register",
      component: <Register setUser={setUser} />,
      constraints: [loggedOut],
      display: ["nav"],
    },
    {
      title: "Logout",
      to: "/:subPath?/logout",
      component: <Logout setUser={setUser} />,
      constraints: [loggedIn],
      display: ["nav"],
    },
    { title: "Docs", to: "/docs/:docType?", component: <Docs />, display: [] },
    { title: "Opps", to: "*", component: <NotFound />, display: [] },
  ];

  return (
    <div className="bg-gray-800">
      <Header user={user} navItems={navItems} />
      <Breadcrumb location={location.pathname.replace("/", "")} />

      <main className="size-full">
        <Routes>
          {navItems.map((item) => (
            <Route key={item.title} path={item.to} element={item.component} />
          ))}
        </Routes>
      </main>

      <Footer navItems={navItems} />
    </div>
  );
}
