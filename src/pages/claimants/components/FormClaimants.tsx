import React from "react";
import { Form, Input, Button, Select, InputNumber, Row, Col } from "antd";
import { createStates, updateState } from "../claiman";

interface Props {
  states: any[];
  selectedClaimant: any;
  onClose: () => void;
}

const { Item } = Form;

const FormClaimants: React.FC<Props> = ({
  states,
  selectedClaimant,
  onClose,
}) => {
  const onFinish = (values: any) => {
    if (selectedClaimant) {
      updateState(selectedClaimant.id, values);
    } else {
      createStates(values);
    }

    onClose();
  };

  return (
    <Form onFinish={onFinish} initialValues={selectedClaimant}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Item label="Name" name="name">
            <Input placeholder="Enter name" />
          </Item>
        </Col>

        <Col span={12}>
          <Item label="Estados" name="stateId">
            <Select
              mode="tags"
              placeholder="Seleccione uno o varios estados"
              options={states}
            />
          </Item>
        </Col>

        <Col span={12}>
          <Item label="Frutas" name="fruit">
            <Input placeholder="Seleccione la fruta" />
          </Item>
        </Col>

        <Col span={12}>
          <Item label="Cantidad" name="quantity">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Seleccione la cantidad"
              min={0}
            />
          </Item>
        </Col>

        <Col span={12}>
          <Button type="primary" style={{ width: "100%" }} htmlType="submit">
            Crear
          </Button>
        </Col>

        <Col span={12}>
          <Button
            danger
            type="primary"
            style={{ width: "100%" }}
            htmlType="submit"
          >
            Cancelar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default FormClaimants;
