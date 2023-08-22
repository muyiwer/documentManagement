/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Spin,
  Switch,
  Table,
  Tag,
} from "antd";
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
export const Roles = () => {
  const state = useContext(CompressContext);
  const {
    postData,
    loading,
    dataSource,
    response,
    postOptionData,
    postPayload,
    payload,
    setRequest,
    setResponse,
    showModal,
    setShowModal,
    setPayload,
    ID,
    setID,
  } = useApi("roles");
  useMemo(() => {
    postData(undefined, "adminRoles", { page: 0, size: 50 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useMemo(() => {
    postOptionData(undefined, "permissions", { page: 0, size: 50 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const setPermissionNames = useCallback(
    (checked: any, id: number) => {
      const permissionNames = response?.permissions;
      if (Array.isArray(permissionNames)) {
        const index = permissionNames.findIndex((x) => x.id === id);
        const updatedItems = { ...permissionNames[index], checked };
        const newItems = [
          ...permissionNames.slice(0, index),
          updatedItems,
          ...permissionNames.slice(index + 1),
        ];
        setResponse({ permissions: [...newItems] });
      }
    },
    [response?.permissions, setResponse]
  );
  const [actionType, setActionType] = useState<"delete" | "create" | "edit">(
    "create"
  );
  const setDetails = useCallback(
    (record: any) => {
      setActionType("edit");
      setPayload({ name: record.name });
      if (Array.isArray(record.permissions)) {
        const permissionNames = response?.permissions;
        permissionNames.forEach((element) => {
          element["checked"] = false;
        });
        const permissions = mergeAndRemoveDuplicates(
          permissionNames,
          record.permissions
        );
        setResponse({ permissions });
      }
      setShowModal(true);
      setID(record.id);
    },
    [response?.permissions, setID, setPayload, setResponse, setShowModal]
  );
  const setDeleteModal = useCallback(
    (record: any) => {
      setActionType("delete");
      setPayload({ name: record.name });
      setShowModal(true);
      setID(record.id);
    },
    [setID, setPayload, setShowModal]
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

  const mergeAndRemoveDuplicates = (arr1: any, arr2: any): any => {
    const idMap = {};
    const result = [] as any;

    arr1.forEach((obj) => {
      idMap[obj.id] = false; // Initialize as non-duplicate
      result.push(obj);
    });

    arr2.forEach((obj) => {
      if (idMap[obj.id] !== undefined) {
        idMap[obj.id] = true; // Mark as duplicate
      } else {
        idMap[obj.id] = false; // Mark as non-duplicate
        result.push(obj);
      }
    });

    // Mark duplicates in the result array
    result.forEach((obj) => {
      obj["checked"] = idMap[obj.id];
    });

    return result;
  };
  const columns: ColumnsType<DataType> = [
    {
      title: "Role Name",
      dataIndex: "name",
      key: "name",
      width: "300px",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Permissions",
      key: "tags",
      dataIndex: "permissions",
      render: (permissions) => (
        <>
          {permissions.map((permission) => {
            const color = permission?.name?.includes("ROLE")
              ? "geekblue"
              : "green";
            return (
              <Tag className="mt-2" color={color} key={permission.id}>
                {permission.name}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Action",
      key: "operations",
      render: (record: any) => (
        <div className="flex gap-1">
          <Button
            onClick={() => setDetails(record)}
            className="bg-[#7847e1] text-white"
          >
            Edit{" "}
          </Button>
          <Button
            onClick={() => setDeleteModal(record)}
            className="bg-[#7847e1] text-white"
          >
            Delete{" "}
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
        onCancel={() => setShowModal(false)}
        centered
        title={
          <div className="text-lg flex justify-center">
            {actionType === "create"
              ? "Create Role"
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
              postPayload(
                actionType === "create"
                  ? "adminRoles/create?name=Users"
                  : actionType === "edit"
                  ? `adminRoles/update/${ID}`
                  : `adminRoles/delete/${payload.name}`,
                {
                  name: payload.name,
                  permissionNames: Array.isArray(response?.permissions)
                    ? response?.permissions
                        .filter((x) => x.checked === true)
                        .map((x) => x.name)
                    : [],
                }
              )
            }
            fields={[{ name: "name", value: payload?.name }]}
          >
            <Row>
              <Col md={24}>
                <Form.Item
                  label="Name"
                  rules={[
                    { required: true, message: "Please enter role name" },
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
                <Form.Item label="Permissions">
                  <Row>
                    {response?.permissions?.map((x) => (
                      <Col key={x.id} md={12} className="mb-3">
                        <Switch
                          onChange={(e) => setPermissionNames(e, x.id)}
                          defaultChecked={x.checked}
                          checked={x.checked}
                        />{" "}
                        <span className="ml-2">{x.name}</span>
                      </Col>
                    ))}
                  </Row>
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
        <AppTitle
          description="All Roles and Permissions"
          title="Roles and Permission"
        />
        <div
          className={`flex flex-col gap-4 ml-[10%] pl-[20px] pr-[10%] mt-[100px] max-md:ml-[0%] max-md:mt-[30px]`}
        >
          {state.permissions?.includes("CREATE_ROLE") ? (
            <Button
              onClick={() => {
                setShowModal(true);
                clearData();
              }}
              className="w-[15%] float-right btn btn-gradient"
            >
              Add New Role
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
