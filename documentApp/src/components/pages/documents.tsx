import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Spin,
  Table,
  Tag,
  UploadProps,
  Upload,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { useMemo, useState, useCallback, useContext } from "react";
import { useApi } from "../../hooks/useApi";
import { AppHeader } from "../header";
import { AppTitle } from "../title";
import { InboxOutlined } from "@ant-design/icons";
import { CompressContext } from "../../App";

const { Dragger } = Upload;

export const DocumentsPage = () => {
  const {
    postData,
    loading,
    dataSource,
    response,
    postOptionData,
    postPayload,
    showModal,
    setShowModal,
    setRequest,
    payload,
    setPayload,
    setID,
  } = useApi("documents");
  useMemo(() => {
    postData(undefined, "documents", { page: 0, size: 100 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isNew, setIsNew] = useState(true);

  const state = useContext(CompressContext);

  const props: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".jpg, .jpeg, .png, application/pdf",
    customRequest(options: any) {
      return options;
    },
    async onChange(info) {
      info.file.status = "done";
      const base64Image = await convertFileToBase64(info.file.originFileObj);
      setPayload({ ...payload, base64Image });
    },
  };
  const convertFileToBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(file);
    });
  };
  const setDetails = useCallback(
    (record: any) => {
      setIsNew(false);
      setID(record.id);
      setShowModal(true);
      console.log(record);
      setPayload({
        fileName: record.name,
        type: record.type?.type,
        url: record?.url,
      });
    },
    [setID, setPayload, setShowModal]
  );
  const columns: ColumnsType<any> = [
    {
      title: "File Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "FIle Type",
      key: "type",
      dataIndex: "type",
      render: (record) => (
        <Tag className="mt-2" color={"purple"} key={record?.type}>
          {record?.type}
        </Tag>
      ),
    },
    {
      title: "Approval Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          className="mt-2"
          color={
            status.toLowerCase() === "pending"
              ? "orange"
              : status.toLowerCase() === "approved"
              ? "green"
              : "red"
          }
          key={status}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: 'operation',
      render: (record: any) => (
        <Button
          onClick={() => setDetails(record)}
          className="bg-[#7847e1] text-white"
        >
          View File
        </Button>
      ),
    },
  ];

  return (
    <section className="grid">
      <Modal
        open={showModal}
        footer={null}
        centered
        onCancel={() => setShowModal(false)}
        title={
          <div className="text-lg flex justify-center">
            {isNew ? "Create Document" : "Document Details"}
          </div>
        }
      >
        {isNew ? (
          <Form
            layout="vertical"
            className="w-[550px]"
            onFinish={() =>
              postPayload("documents/create", {
                base64Image: payload.base64Image,
                documentTypId: payload.documentTypId,
                fileName: payload.fileName,
              })
            }
            fields={[
              {
                name: "base64Image",
                value: payload?.base64Image,
              },
              {
                name: "documentTypId",
                value: payload?.documentTypId,
              },
              {
                name: "fileName",
                value: payload?.fileName,
              },
            ]}
          >
            <Row>
              <Col md={12}>
                <Form.Item
                  label="File Name"
                  rules={[
                    { required: true, message: "Please enter file name" },
                  ]}
                  name="fileName"
                >
                  <Input
                    onChange={(e) => setRequest("fileName", e.target.value)}
                    className="bg-white text-black"
                  />
                </Form.Item>
              </Col>
              <Col md={12}>
                {" "}
                <Form.Item
                  name="documentTypId"
                  label="Format"
                  rules={[
                    { required: true, message: "Please select user role" },
                  ]}
                >
                  <fieldset>
                    <div className="relative border text-gray-800 bg-white shadow-lg w-[70%] border-orange-500">
                      <select
                        onClick={(e) => {
                          postOptionData(e, "documentTypes", {
                            page: 0,
                            size: 100,
                          });
                        }}
                        onChange={(e) => {
                          e.preventDefault();
                          setRequest(
                            "documentTypId",
                            parseInt(e.currentTarget.value)
                          );
                        }}
                        className="appearance-none w-full py-1 px-2 bg-white"
                        name="documentTypId"
                        id="frm-whatever"
                        placeholder={"Please choose a document type"}
                      >
                        <option value={"0"}>{"Choose a document type"}</option>
                        {Array.isArray(response?.documentType)
                          ? response?.documentType.map((x) => (
                              <option key={x.id} value={x.id}>
                                {x.type}
                              </option>
                            ))
                          : ""}
                      </select>
                      <div className="pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2 text-gray-700 border-l">
                        <svg
                          className="h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </fieldset>
                </Form.Item>
              </Col>
              <Col md={20}>
                <Dragger {...props} className="">
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className=" text-black">
                    Click or drag file to this area to upload
                  </p>
                  <p className="text-black">
                    Support for only single upload. Strictly prohibited from
                    uploading company data or other banned files.
                  </p>
                </Dragger>
              </Col>
              <Col md={24} className="mt-[50px]">
                {" "}
                <Button
                  htmlType="submit"
                  className="float-right mr-[15%] btn btn-gradient"
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <span className="font-extrabold">File Name</span>{" "}
              <span>{payload.fileName}</span>
            </div>
            <div className="flex gap-4">
              <span className="font-extrabold">File Type</span>{" "}
              <Tag color={"pink"}>{payload.type}</Tag>
            </div>
            {payload.type?.toLowerCase().includes("pdf") ? (
              <object
                data={payload.url}
                type="application/pdf"
                width="100%"
                height="500"
              >
                <p>
                  Your browser doesn't support embedded PDFs. You can{" "}
                  <a href={payload.url}>download the PDF</a> instead.
                </p>
              </object>
            ) : (
              <img className=" rounded-lg" alt="" src={payload.url} />
            )}
            <div className="mt-5 flex justify-end">
              <Button onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
      <AppHeader />
      <main>
        <AppTitle
          description="All documents uploaded by user"
          title="Documents"
        />

        <div
          className={`flex flex-col gap-4 ml-[10%] pl-[20px] pr-[10%] mt-[100px] max-md:ml-[0%] max-md:mt-[30px]`}
        >
          {state.permissions?.includes("CREATE_DOCUMENT") ? (
            <Button
              onClick={() => {
                setIsNew(true);
                setShowModal(true);
                setPayload({});
              }}
              className="w-[15%] float-right btn btn-gradient"
            >
              Add New Document
            </Button>
          ) : (
            ""
          )}

          <Spin spinning={loading}>
            <Table
              columns={columns}
              className=""
              dataSource={dataSource}
              scroll={{ x: 200 }}
            />
          </Spin>
        </div>
      </main>
      <footer style={{ textAlign: "center" }}>
        Powered by Oluwatosin Adeogun
      </footer>
    </section>
  );
};
