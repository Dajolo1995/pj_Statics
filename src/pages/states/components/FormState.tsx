import React from "react";
import { Form, Input, InputNumber, Button, Row, Col } from "antd";
import { createStates, updateState } from "../stateFunction";

const { Item } = Form;

interface Props {
  handleCloseModal: () => void;
  stateData: any;
}

const FormState: React.FC<Props> = ({ handleCloseModal, stateData }) => {
  const onFinish = async (values: any) => {
    try {
      if (stateData.id) {
        updateState(stateData.id, values);
      } else {
        createStates(values);
      }
    } catch (error) {
      console.error("Error creating state:", error);
    } finally {
      handleCloseModal();
    }
  };

  return (
    <Form onFinish={onFinish} initialValues={stateData} layout="vertical">
      <Item
        label="Nombre del estado"
        name="name"
        rules={[
          { required: true, message: "Por favor ingrese el nombre del estado" },
        ]}
      >
        <Input placeholder="Ingrese el nombre del estado" />
      </Item>
      <Item
        label="Cantidad"
        name="quantity"
        rules={[
          {
            required: true,
            message: "Por favor ingrese la cantidad, la cantidad minima es 1",
          },
        ]}
      >
        <InputNumber
          min={1}
          max={1000}
          style={{ width: "100%" }}
          placeholder="Ingrese la cantidad"
        />
      </Item>

      <Row gutter={[8, 8]}>
        <Col md={12}>
          <Button type="primary" htmlType="submit" block>
            {stateData?.id ? "Actualizar" : "Crear"}
          </Button>
        </Col>

        <Col md={12}>
          <Button type="primary" danger htmlType="submit" block>
            Cancelar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default FormState;
