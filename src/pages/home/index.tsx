import React, { useEffect, useState } from "react";
import LayoutApp from "@/components/layout";
import { getStates } from "../states/stateFunction";
import Content from "./components/Content";
import { getClaimants } from "../claimants/claiman";

const Home: React.FC = () => {
  const [stateData, setStateData] = useState<any>(null);
  const [stateClaiments, setStateClaiments] = useState<any>(null);

  const getDataStates = async () => {
    try {
     const values =  await getStates();

      setStateData(values);
    } catch (error) {}
  };

  const getDataClaimants = async () => {
    try {
      const values = await getClaimants();
      setStateClaiments(values);
    } catch (error) {}
  };

  useEffect(() => {
    getDataStates();
    getDataClaimants();
  }, []);

  return (
    <LayoutApp>
      <Content stateData={stateData} stateClaiments={stateClaiments} />
    </LayoutApp>
  );
};

export default Home;
