import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { CompressContext } from "../App";
import { useContext } from "react";

export const AppHeader = () => {
  const navigate = useNavigate();
  const state = useContext(CompressContext);
  const logout = () => {
    navigate("/");
    localStorage.clear();
  };

  return (
    <header className="flex flex-row justify-between items-center w-[100.5vw]">
      <div className="logo">
        <h1 className="font-extrabold max-md:hidden">
          <span className="text-[#7847e1] text-xl">Document</span>
          <span className="text-[#dd568d] text-xl">App</span>
        </h1>
      </div>{" "}
      <nav className="flex gap-4">
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
                ? "text-[#dd568d] font-extrabold"
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
                ? "text-[#dd568d] font-extrabold"
                : ""
            } cursor-pointer`}
            onClick={() => navigate("/users")}
          >
            Users
          </div>
        ) : (
          ""
        )}

        {state.permissions?.includes("VIEW_ROLE") ? (
          <div
            className={`${
              window.location.href.includes("roles")
                ? "text-[#dd568d] font-extrabold"
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
                ? "text-[#dd568d] font-extrabold"
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
            <LogoutOutlined /> <div className="max-md:hidden">LogOut</div>
          </div>
        </Button>
      </div>
    </header>
  );
};
