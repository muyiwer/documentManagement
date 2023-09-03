import { Button, Card, Col, Form, Input, Modal, Row, Spin, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useCallback, useContext, useMemo, useState } from "react";
import { CompressContext } from "../../App";
import { useApi } from "../../hooks/useApi";
import { AppHeader } from "../header";
import { AppTitle } from "../title";

export const UsersPage = () => {
  const state = useContext(CompressContext);
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
    ID,
    setID,
  } = useApi("users");

  useMemo(() => {
    postData(undefined, "users", { page: 0, size: 100 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isNew, setIsNew] = useState(true);
  const setDetails = useCallback(
    (record: any) => {
      setIsNew(false);
      setID(record.id);
      setShowModal(true);
      setPayload({
        username: record.username,
        email: record.email,
        roleId: record?.role?.id,
        roleName: record?.role?.name,
      });
    },
    [setID, setPayload, setShowModal]
  );

  const columns: ColumnsType<any> = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "200px",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "UserName",
      width: "150px",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Role",
      width: "150px",
      dataIndex: "role",
      key: "role",
      render: (role) => <a>{role?.name}</a>,
    },
    {
      title: "Permissions",
      key: "tags",
      dataIndex: "role",
      render: (role) => (
        <>
          {Array.isArray(role?.permissions) ? (
            role?.permissions.map((permission) => {
              const color = permission?.name?.includes("ROLE")
                ? "geekblue"
                : "green";
              return (
                <Tag className="mt-2" color={color} key={permission.id}>
                  {permission.name}
                </Tag>
              );
            })
          ) : (
            <></>
          )}
        </>
      ),
    },
    {
      title: "Action",
      key: "operation",
      render: (record: any) => (
        <div className="flex gap-1">
          <Button
            onClick={() => setDetails(record)}
            className="bg-[#b90d0d] text-white"
          >
            Edit User{" "}
          </Button>
        </div>
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
            {isNew ? "Create User" : "Update User"}
          </div>
        }
      >
        <Form
          layout="vertical"
          className="w-[550px]"
          onFinish={() =>
            postPayload(isNew ? "users/sign-up" : `users/update/${ID}`, {
              email: payload.email,
              password: payload.password,
              roleId: payload.roleId,
              username: payload.username,
            })
          }
          fields={[
            {
              name: "email",
              value: payload?.email,
            },
            {
              name: "username",
              value: payload?.username,
            },
            {
              name: "password",
              value: payload?.password,
            },
            {
              name: "roleId",
              value: payload?.roleId,
            },
            {
              name: "roleName",
              value: payload?.roleName,
            },
          ]}
        >
          <Row>
            <Col md={12}>
              <Form.Item
                label="UserName"
                rules={[{ required: true, message: "Please enter user name" }]}
                name="username"
              >
                <Input
                  onChange={(e) => setRequest("username", e.target.value)}
                  className="bg-white text-black"
                />
              </Form.Item>
            </Col>
            <Col md={12}>
              {" "}
              <Form.Item
                rules={[
                  {
                    type: "email",
                    required: true,
                    message: "Please enter a valid",
                  },
                  {
                    required: true,
                    message: "Please enter your email",
                  },
                ]}
                label="Email"
                name="email"
              >
                <Input
                  onChange={(e) => setRequest("email", e.target.value)}
                  className="bg-white text-black"
                />
              </Form.Item>
            </Col>
            <Col md={12}>
              {" "}
              {isNew ? (
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: "Please enter password" }]}
                >
                  <Input
                    type={"password"}
                    onChange={(e) => setRequest("password", e.target.value)}
                    className="bg-white text-black"
                  />
                </Form.Item>
              ) : (
                ""
              )}
            </Col>
            <Col md={12}>
              {" "}
              <Form.Item
                name="roleId"
                label="Role"
                rules={[{ required: true, message: "Please select user role" }]}
              >
                <fieldset>
                  <div className="relative border text-gray-800 bg-white shadow-lg w-[70%] border-orange-500">
                    <select
                      onClick={(e) => {
                        postOptionData(e, "adminRoles", { page: 0, size: 50 });
                      }}
                      onChange={(e) => {
                        e.preventDefault();
                        setRequest("roleId", parseInt(e.currentTarget.value));
                      }}
                      className="appearance-none w-full py-1 px-2 bg-white"
                      name="roleId"
                      id="frm-whatever"
                      placeholder={"Please choose a role"}
                    >
                      <option disabled selected hidden value={"0"}>
                        {isNew ? "Please choose a role" : payload?.roleName}
                      </option>
                      <option disabled></option>
                      {Array.isArray(response?.roles)
                        ? response?.roles.map((x) => (
                            <option key={x.id} value={x.id}>
                              {x.name}
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
            <Col md={24}>
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
      </Modal>
      <AppHeader />
      <main>
        <AppTitle description="All users" title="Users" />
        <div
          className={`flex flex-col gap-4 ml-[10%] pl-[20px] pr-[10%] mt-[100px] max-md:ml-[0%] max-md:mt-[30px]`}
        >
          {state.permissions?.includes("CREATE_USER") ? (
            <Button
              onClick={() => {
                setIsNew(true);
                setShowModal(true);
                setPayload({});
              }}
              className="max-md:w-[30%] w-[15%] float-right btn btn-gradient"
            >
              Add New User
            </Button>
          ) : (
            ""
          )}
          <Spin spinning={loading}>
          <Card className="box-shadow">
            <Table
              columns={columns}
              className="w-[105vw]"
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
