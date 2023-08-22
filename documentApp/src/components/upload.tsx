import { message, Upload, UploadProps } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useCompress } from "../hooks/useCompress";
const { Dragger } = Upload;
export const AppUpload = () => {
  const { upload, image } = useCompress();
  const props: UploadProps = {
    name: "file",
    multiple: true,
    accept: "image/png, image/jpeg, image/webp, image/jpg",
    showUploadList: false,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange({ file, fileList }) {
      const { status } = file;
      if (status !== "uploading") {
        upload(file.originFileObj as any, fileList);
      }
      if (status === "error") {
        message.success(`${file.name} file upload successfully.`);
      }
    },
    onDrop(e) {
      upload(e.dataTransfer.files as any, e.dataTransfer.files as any);
    },
  };
  return (
    <div className="upload">
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined className="upload-icon" />
        </p>
        {image?.length ? (
          image.map((x) => (
            <img height={200} width={200} className="image" src={x} alt="" />
          ))
        ) : (
          <>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support only a single upload. Strictly prohibited from uploading
              company data or other banned files.
            </p>
          </>
        )}
      </Dragger>
    </div>
  );
};
