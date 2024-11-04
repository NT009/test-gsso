import React from "react";
import { Card, Avatar, Typography, Button, Space } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;
const Profile: React.FC<any> = ({ user, onLogout }) => {
  return (
    <Card>
      <div style={{ textAlign: "center" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Avatar src={user.picture} size={96} alt="Profile" />
          <div>
            <Title level={3} style={{ margin: 0 }}>
              {user.name}
            </Title>
            <Text type="secondary">{user.email}</Text>
          </div>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={onLogout}
            block
          >
            Logout
          </Button>
        </Space>
      </div>
    </Card>
  );
};

export default Profile;
