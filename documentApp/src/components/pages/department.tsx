/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Card, Col, Form, Input, Modal, Row, Spin, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useCallback, useContext, useMemo, useState } from "react";
import { CompressContext } from "../../App";
import { useApi } from "../../hooks/useApi";
import { AppHeader } from "../header";
import { AppTitle } from "../title";

interface DataType {
  key: string;
  name: string;
  age: string;
  address: string;
  tags: string[];
}
export const Department = () => {
  const state = useContext(CompressContext);
  const {
    postData,
    loading,
    dataSource,
    response,
    postPayload,
    payload,
    setRequest,
    setResponse,
    showModal,
    setShowModal,
    setPayload,
    ID,
  } = useApi("department");
  useMemo(() => {
    postData(undefined, "dept", { page: 0, size: 50 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [actionType, setActionType] = useState<"delete" | "create" | "edit">(
    "create"
  );

  const clearData = useCallback(() => {
    const permissions = response?.permissions;
    permissions.forEach((element) => {
      element["checked"] = false;
    });
    setActionType("edit");
    setPayload({});
    setResponse({ permissions });
  }, [response?.permissions, setPayload, setResponse]);

  const columns: ColumnsType<DataType> = [
    {
      title: "Department Name",
      dataIndex: "name",
      key: "name",
      width: "300px",
      render: (text) => <a>{text}</a>,
    },
  ];

  return (
    <section className="grid">
      <Modal
        open={showModal}
        footer={null}
        onCancel={() => setShowModal(false)}
        centered
        title={
          <div className="text-lg flex justify-center">
            {actionType === "create"
              ? "Create Department"
              : actionType === "edit"
              ? "Update Role"
              : "Delete Role"}
          </div>
        }
      >
        {actionType === "delete" ? (
          <div className="flex flex-col gap-5 justify-center items-center">
            <h1 className="text-lg">
              Are you sure you want to delete{" "}
              <span className="font-bold">{payload.name}</span>
            </h1>
            <Button
              htmlType="button"
              onClick={() => postPayload(`adminRoles/delete/${ID}`, {})}
              loading={loading}
              className="float-right btn btn-gradient"
            >
              Delete
            </Button>
          </div>
        ) : (
          <Form
            layout="vertical"
            className="w-[550px]"
            onFinish={() =>
              postPayload("dept/create", {
                name: payload.name,
              })
            }
            fields={[{ name: "name", value: payload?.name }]}
          >
            <Row>
              <Col md={24}>
                <Form.Item
                  label="Name"
                  rules={[
                    { required: true, message: "Please enter Department name" },
                  ]}
                  name="name"
                >
                  <Input
                    onChange={(e) => setRequest("name", e.target.value)}
                    className="bg-white text-black"
                  />
                </Form.Item>
              </Col>
              <Col md={24}>
                {" "}
                <Button
                  htmlType="submit"
                  loading={loading}
                  className="float-right mr-[15%] btn btn-gradient"
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>
      <AppHeader />
      <main>
        <AppTitle description="update user department" title="Department" />
        <div
          className={`flex flex-col gap-4 ml-[10%] pl-[20px] pr-[10%] mt-[100px] max-md:ml-[0%] max-md:mt-[30px]`}
        >
          {state.permissions?.includes("CREATE_DEPARTMENT") ? (
            <Button
              onClick={() => {
                setShowModal(true);
                clearData();
                setActionType("create");
              }}
              className="w-[17%] float-right btn btn-gradient"
            >
              Add New Department
            </Button>
          ) : (
            ""
          )}

          <Spin spinning={loading}>
            <Card className="box-shadow">
              <Table
                columns={columns}
                className=""
                dataSource={dataSource}
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
