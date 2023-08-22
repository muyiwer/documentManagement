import { Input, Button, Tabs, TabsProps } from "antd";
import { useCompress } from "../hooks/useCompress";
import { FullscreenExitOutlined } from "@ant-design/icons";

export const ImageOptions = () => {
  const { setOptions, compress, file } = useCompress();
  const items: TabsProps["items"] = [
    {
      key: "2",
      label: `Dimension`,
      children: (
        <div className="option-properties text-white">
          <div className="property-between">
            <span>Width </span>{" "}
            <Input
              type="number"
              onChange={(e) => setOptions("originalWidth", e.target.value)}
              className="input"
            />
          </div>
          <div className="property-between">
            <span>Height </span>{" "}
            <Input
              type="number"
              onChange={(e) => setOptions("originalHeight", e.target.value)}
              className="input"
            />
          </div>
          <div className="property-between">
            <div></div>
            <Button
              onClick={() => compress(file?.originalFile?.fileObj)}
              style={{
                marginTop: 10,
                marginBottom: 10,
              }}
              icon={<FullscreenExitOutlined />}
              className="button"
            >
              Compress
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: "1",
      label: `Size`,
      children: (
        <div className="option-properties">
          <div className="property-between">
            <span>Size </span>{" "}
            <Input
              type="number"
              onChange={(e) => setOptions("size", e.target.value)}
              className="input"
            />
          </div>
          <div className="property-between">
            <div></div>
            <Button
              onClick={() => compress(file?.originalFile?.fileObj)}
              style={{
                marginTop: 10,
                marginBottom: 10,
              }}
              icon={<FullscreenExitOutlined />}
              className="button"
            >
              Compress
            </Button>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="options">
      <div className="option-header">Options</div>
      <Tabs defaultActiveKey="1" items={items} className="text-white" />
    </div>
  );
};
