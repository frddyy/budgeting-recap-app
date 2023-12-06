import React, { useState } from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { ChakraProvider, Portal, useDisclosure } from "@chakra-ui/react";
import Configurator from "components/Configurator/Configurator";
import Footer from "components/Footer/Footer.js";
import theme from "theme/theme.js";
import Sidebar from "components/Sidebar";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import FixedPlugin from "../components/FixedPlugin/FixedPlugin";
import MainPanel from "../components/Layout/MainPanel";
import PanelContainer from "../components/Layout/PanelContainer";
import PanelContent from "../components/Layout/PanelContent";
import routes from "routes.js";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export default function Dashboard(props) {
  const { ...rest } = props;
  const [sidebarVariant, setSidebarVariant] = useState("transparent");
  const [fixed, setFixed] = useState(false);

  const getRoute = () => {
    return window.location.pathname !== "/admin/full-screen-maps";
  };

  const getActiveRoute = (routes) => {
    let activeRoute = "Profile";
    let currentPath = window.location.pathname; // Dapatkan path saat ini
    let match = useRouteMatch("/admin/budgets/:category"); // Ganti dengan path yang sesuai

    if (match) {
      activeRoute = `Budgets / ${match.params.category}`;
    } else {
      for (let i = 0; i < routes.length; i++) {
        if (routes[i].collapse) {
          let collapseActiveRoute = getActiveRoute(routes[i].views);
          if (collapseActiveRoute !== activeRoute) {
            return collapseActiveRoute;
          }
        } else if (routes[i].category) {
          let categoryActiveRoute = getActiveRoute(routes[i].views);
          if (categoryActiveRoute !== activeRoute) {
            return categoryActiveRoute;
          }
        } else {
          let routePath = routes[i].layout + routes[i].path;
          // Mengganti parameter rute dinamis seperti ':category' dengan regex wildcard
          let modifiedRoutePath = routePath.replace(/:\w+/g, "[^/]+");

          // Membuat RegExp dari modifiedRoutePath
          let routePathRegex = new RegExp("^" + modifiedRoutePath + "$");

          if (routePathRegex.test(currentPath)) {
            return routes[i].name;
          }
        }
      }
    }
    return activeRoute;
  };

  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].category) {
        let categoryActiveNavbar = getActiveNavbar(routes[i].views);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          if (routes[i].secondaryNavbar) {
            return routes[i].secondaryNavbar;
          }
        }
      }
    }
    return activeNavbar;
  };

  // Filter routes that have the hidden property set to true
  const filteredRoutes = routes.filter((route) => !route.hidden);

  const getRoutes = () => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  document.documentElement.dir = "ltr";

  return (
    <ChakraProvider theme={theme} resetCss={false}>
      <Sidebar
        routes={filteredRoutes} // Use the filtered routes
        logoText={"SPEND WISE"}
        display="none"
        sidebarVariant={sidebarVariant}
        {...rest}
      />
      <MainPanel
        w={{
          base: "100%",
          xl: "calc(100% - 275px)",
        }}
      >
        <Portal>
          <AdminNavbar
            onOpen={onOpen}
            logoText={"SPEND WISE"}
            brandText={getActiveRoute(filteredRoutes)} // Use the filtered routes
            secondary={getActiveNavbar(filteredRoutes)} // Use the filtered routes
            fixed={fixed}
            {...rest}
          />
        </Portal>
        {getRoute() ? (
          <PanelContent>
            <PanelContainer>
              <Switch>
                {getRoutes()} {/* Use the filtered routes */}
                <Redirect from="/admin" to="/admin/dashboard" />
              </Switch>
            </PanelContainer>
          </PanelContent>
        ) : null}
        <Footer />
        <Portal>
          <FixedPlugin
            secondary={getActiveNavbar(filteredRoutes)}
            fixed={fixed}
            onOpen={onOpen}
          />
        </Portal>
        <Configurator
          secondary={getActiveNavbar(filteredRoutes)} // Use the filtered routes
          isOpen={isOpen}
          onClose={onClose}
          isChecked={fixed}
          onSwitch={(value) => {
            setFixed(value);
          }}
          onOpaque={() => setSidebarVariant("opaque")}
          onTransparent={() => setSidebarVariant("transparent")}
        />
      </MainPanel>
    </ChakraProvider>
  );
}
