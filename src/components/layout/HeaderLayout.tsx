import { BellOutlined, ClockCircleOutlined, ExportOutlined, SearchOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Input, Layout, Tooltip } from "antd";
import React from "react";
import type { NavigateFunction } from "react-router-dom";
import {buttonColors} from "@/tools/theme";

const { Header } = Layout;

interface Props {
  headerTabs: {
    label: string;
    path: string;
  }[];

  activeTab: () => "Dashboard" | "Estate Management" | "Legal Framework";
  navigate: NavigateFunction;
}

const HeaderLayout: React.FC<Props> = ({ headerTabs, activeTab, navigate }) => {
  return (
    <Header className="fs-header">
      <div className="fs-header__tabs">
        {headerTabs.map((tab) => (
          <span
            key={tab.label}
            className={`fs-header__tab ${
              activeTab() === tab.label ? "fs-header__tab--active" : ""
            }`}
            onClick={() => navigate(tab.path)}
          >
            {tab.label}
          </span>
        ))}
      </div>

      <div className="fs-header__actions">
        <Input
          prefix={<SearchOutlined style={{ color: "#B0B5BD" }} />}
          placeholder="Search case files..."
          className="fs-header__search"
          size="middle"
        />

        <Tooltip title="Notifications">
          <Badge dot offset={[-2, 2]}>
            <Button
              type="text"
              icon={<BellOutlined style={{ fontSize: 18 }} />}
              className="fs-header__icon-btn"
            />
          </Badge>
        </Tooltip>

        <Tooltip title="Recent activity">
          <Button
            type="text"
            icon={<ClockCircleOutlined style={{ fontSize: 18 }} />}
            className="fs-header__icon-btn"
          />
        </Tooltip>

        <Button
          type="primary"
          icon={<ExportOutlined />}
          className="fs-header__export"
          style={{
            background: buttonColors.primary,
          }}
        >
          Export Report
        </Button>

        <Avatar size={36} className="fs-header__avatar">
          DL
        </Avatar>
      </div>
    </Header>
  );
};

export default HeaderLayout;
