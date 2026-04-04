import { Button, Col, Input, Row, Select } from "antd";
import React from "react";

interface Props {
  actionButton: any[];
  states: any[];
}

const Action: React.FC<Props> = ({ actionButton, states }) => {
  return (
    <Row gutter={[8, 8]} style={{ marginBottom: "32px" }}>
      <Col xs={24} md={6}>
        <Input placeholder="Search..." />
      </Col>

      <Col xs={24} md={6}>
        <Select style={{ width: "100%" }} placeholder="Select an option" options={states} />
      </Col>

      {actionButton.map((button: any, index: number) => (
        <Col
          key={index}
          xs={24}
          md={4}
          style={{
            textAlign: index === 0 ? "right" : index === 1 ? "center" : "left",
          }}
        >
          <Button
            icon={button.icon}
            style={{ width: "100%" }}
            type={button.type}
            onClick={button.onClick}
          >
            {button.text}
          </Button>
        </Col>
      ))}
    </Row>
  );
};

export default Action;
