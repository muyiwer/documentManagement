import { Button, Card, Col, Form, Input, Modal, Spin, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useMemo, useState, useCallback } from "react";
import { useApi } from "../../hooks/useApi";
import { AppHeader } from "../header";
import { AppTitle } from "../title";

export const ApprovalPage = () => {
  const {
    postData,
    loading,
    dataSource,
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

  const setDetails = useCallback(
    (record: any) => {
      setIsNew(false);
      setID(record.id);
      setShowModal(true);
      setPayload({
        fileName: record.name,
        type: record.type?.type,
        url: record?.url,
        id: record.id,
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
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (text) => <a>{text}</a>,
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
      key: "action",
      render: (record: any) => (
        <Button
          onClick={() => setDetails(record)}
          className="bg-[#b90d0d] text-white"
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
            <img className=" rounded-lg h-[300px]" alt="" src={payload.url} />
          )}
          <Form
            onFinish={() =>
              postPayload(`temps/performAction/${payload.id}`, {
                reason: payload.reason,
                status: payload.status,
              })
            }
            layout="vertical"
            fields={[
              {
                name: "reason",
                value: payload?.reason,
              },
              {
                name: "status",
                value: payload?.status,
              },
            ]}
          >
            <Col md={24}>
              <Form.Item
                label="Reason for Rejection"
                name="reason"
              >
                <Input.TextArea
                  onChange={(e) => setRequest("reason", e.target.value)}
                  className="bg-white text-black"
                />
              </Form.Item>
            </Col>
            <div className="mt-5 gap-3 flex justify-end">
              <Button
                loading={loading}
                htmlType="submit"
                className="btn btn-gradient"
                onClick={() => setRequest("status", "APPROVED")}
              >
                Approve
              </Button>
              <Button
                loading={loading}
                htmlType="submit"
                className="btn bg-red-600"
                onClick={() => setRequest("status", "DECLINED")}
              >
                Disapprove
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
      <AppHeader />
      <main>
        <AppTitle
          description="All documents uploaded by user for approval"
          title="Approve Documents"
        />

        <div
          className={`flex flex-col gap-4 ml-[10%] pl-[20px] pr-[10%] mt-[100px] max-md:ml-[0%] max-md:mt-[30px]`}
        >
          <Spin spinning={loading}>
            <Card className="box-shadow">
              <Table
                columns={columns}
                className=""
                dataSource={dataSource?.filter((x) => x.status === "PENDING")}
                scroll={{ x: 200 }}
              />
            </Card>
          </Spin>
        </div>
      </main>
      <footer style={{ textAlign: "center" }}>
        Powered by Oluwatosin Adeogun
      </footer>
    </section>
  );
};
