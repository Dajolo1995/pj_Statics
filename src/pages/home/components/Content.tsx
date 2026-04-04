import React from "react";
import { Row, Col } from "antd";
import State from "./State";
import Claimants from "./Claiments";
import DemandChart from "./DemandChart";
import PressureChart from "./PressureChart";

interface ContentProps {
  stateData: any;
  stateClaiments: any;
}

const Content: React.FC<ContentProps> = ({ stateData, stateClaiments }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <State stateData={stateData} />
      </Col>

      <Col span={12}>
        <Claimants data={stateClaiments} />
      </Col>

      <Col span={12}>
        <DemandChart data={stateClaiments} />
      </Col>

      <Col span={12}>
        <PressureChart data={stateClaiments} />
      </Col>

  
    </Row>
  );
};

export default Content;