import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { CompressContext } from "../App";
import { useContext, useEffect, useState } from "react";
import { TeamOutlined } from "@ant-design/icons";

export const AppHeader = () => {
  const navigate = useNavigate();
  const [user, setuser] = useState({} as any);
  const state = useContext(CompressContext);
  const logout = () => {
    navigate("/");
    localStorage.clear();
  };

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("***") as string);
      setuser(user);
    } catch (_error) {
      console.log("none");
    }
  }, []);

  return (
    <>
      <header className="flex flex-row justify-between items-center w-[100.5vw]">
        <div className="logo">
          {/* <h1 className="font-extrabold max-md:hidden">
          <span className="text-[#7847e1] text-xl">Document</span>
          <span className="text-[#dd568d] text-xl">App</span>
        </h1> */}
          <img
            className="max-md:hidden w-[100px]"
            src="https://unilag.edu.ng/wp-content/uploads/Untitled-7-5.png"
            alt=""
          />
        </div>{" "}
        <nav className="flex gap-4 text-white">
          {/* <div
          className={`${
            window.location.href.includes("home")
              ? "text-[#dd568d] font-extrabold"
              : ""
          } cursor-pointer`}
          onClick={() => navigate("/home")}
        >
          Home
        </div> */}
          {state.permissions?.includes("VIEW_DOCUMENT") ? (
            <div
              className={`${
                window.location.href.includes("documents")
                  ? "text-[#3c9fa1] font-extrabold"
                  : ""
              } cursor-pointer`}
              onClick={() => navigate("/documents")}
            >
              Documents
            </div>
          ) : (
            ""
          )}

          {state.permissions?.includes("VIEW_USER") ? (
            <div
              className={`${
                window.location.href.includes("users")
                  ? "text-[#3c9fa1] font-extrabold"
                  : ""
              } cursor-pointer`}
              onClick={() => navigate("/users")}
            >
              Users
            </div>
          ) : (
            ""
          )}
          {state.permissions?.includes("VIEW_DEPARTMENT") ? (
            <div
              className={`${
                window.location.href.includes("department")
                  ? "text-[#3c9fa1] font-extrabold"
                  : ""
              } cursor-pointer`}
              onClick={() => navigate("/department")}
            >
              Department
            </div>
          ) : (
            ""
          )}

          {state.permissions?.includes("VIEW_ROLE") ? (
            <div
              className={`${
                window.location.href.includes("roles")
                  ? "text-[#3c9fa1] font-extrabold"
                  : ""
              } cursor-pointer`}
              onClick={() => navigate("/roles")}
            >
              Roles
            </div>
          ) : (
            ""
          )}

          {state.permissions?.includes("APPROVE_DOCUMENT") ? (
            <div
              className={`${
                window.location.href.includes("approval")
                  ? "text-[#3c9fa1] font-extrabold"
                  : ""
              } cursor-pointer`}
              onClick={() => navigate("/approval")}
            >
              Approval
            </div>
          ) : (
            ""
          )}
        </nav>
        <div className="pt-2 pr-5 ml-2">
          <Button className="button" onClick={logout}>
            <div className="flex gap-1 items-center">
              <LogoutOutlined className="text-white" />{" "}
              <div className="max-md:hidden">LogOut</div>
            </div>
          </Button>
        </div>
      </header>
      <div className="text-black mt-4 ml-8 flex flex-col gap-3 -mb-[100px]">
        <div className="flex gap-2">
          <span className="font-bold text-[24px] text-red-800">Welcome </span>{" "}
          <span className="font-bold text-[24px] text-Black">
            {user?.username?.toUpperCase()}
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <TeamOutlined color="black" className="text-[20px] !text-[black]"/>
          <span className="font-bold text-[20px] text-red-800">
            {user.userRole?.name}
          </span>
        </div>
      </div>
    </>
  );
};
