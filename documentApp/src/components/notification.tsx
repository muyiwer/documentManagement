import { notification } from "antd";
import { WarningOutlined,CheckCircleOutlined } from "@ant-design/icons";

export const Notify = (
  message: string,
  isSuccess: boolean
) => {
  return notification.open({
    message: isSuccess ? "Success" : "Error",
    description: message,
    duration: isSuccess ? 10 : 100,
    icon: !isSuccess ? (
      <WarningOutlined style={{ color: "red" }} />
    ) : (
      <CheckCircleOutlined style={{ color: "#006F01" }} />
    ),
  });
};