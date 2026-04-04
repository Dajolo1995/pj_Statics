import React from "react";
import { Row, Col, Button, Input } from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  PlusOutlined,
  AppstoreAddOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

interface Props {
  handleOpenModal: (data?: any) => void;
  handleSearch: (value: string) => void;
  search: () => void;
  getStatesData: () => void;
  stateSearch: string;
  createRamdom: () => void;
  createDemoOfXlsx: () => void;
}

const Action: React.FC<Props> = ({
  handleOpenModal,
  handleSearch,
  search,
  getStatesData,
  stateSearch,
  createRamdom,
  createDemoOfXlsx,
}) => {
  const actions = [
    {
      icon: <SearchOutlined />,
      text: "Buscar",
      type: "primary",
      onClick: () => search(),
    },
    {
      icon: <DeleteOutlined />,
      text: "Limpiar",
      onClick: () => getStatesData(),
    },
    {
      icon: <AppstoreAddOutlined />,
      text: "Agregar Demo",
      type: "default",
      onClick: () => createDemoOfXlsx(),
    },
    {
      icon: <ThunderboltOutlined />,
      text: "Crear Random",
      type: "default",
      onClick: () => createRamdom(),
    },
    {
      icon: <PlusOutlined />,
      text: "Crear",
      type: "primary",
      onClick: () => handleOpenModal(),
    },
  ] as any[];

  return (
    <Row gutter={[12, 12]} style={{ marginBottom: 32 }}>
      {/* Input */}
      <Col xs={24} md={8}>
        <Input
          placeholder="Buscar..."
          prefix={<SearchOutlined />}
          allowClear
          onChange={(e) => handleSearch(e.target.value)}
          value={stateSearch}
        />
      </Col>

      {/* Botones */}
      <Col xs={24} md={16}>
        <Row gutter={[8, 8]} justify="end">
          {actions.map((btn, index) => (
            <Col key={index}>
              <Button icon={btn.icon} type={btn.type} onClick={btn.onClick}>
                {btn.text}
              </Button>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};

export default Action;
