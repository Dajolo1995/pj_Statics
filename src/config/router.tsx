import { lazy } from "react";
const StatesData = lazy(() => import("../pages/states"));
const Home = lazy(() => import("../pages/home"));
const Claimants = lazy(() => import("../pages/claimants"));
const CEAMatrix = lazy(() => import("../pages/cae/CEAMatrix"));

const routerApp = () => {
  return [
    {
      path: "/",
      name: "Inicio",
      element: <Home />,
      sibedar: true,
      header: false,
    },
    {
      path: "/states",
      name: "Estados",
      element: <StatesData />,
      sibedar: true,
      header: false,
    },

    {
      path: "/claimants",
      name: "Reclamantes",
      element: <Claimants />,
      sibedar: true,
      header: false,
    },

    {
      path: "/cea",
      name: "Matriz CEA",
      element: <CEAMatrix />,
      sibedar: true,
      header: false,
    }
  ];
};

export default routerApp;
