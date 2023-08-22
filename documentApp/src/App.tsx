import "./app.mobile.css";
import "./App.css";
import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Auth } from "./components/pages/auth";
import { DocumentsPage } from "./components/pages/documents";
import { UsersPage } from "./components/pages/users";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Roles } from "./components/pages/roles";
import { ApprovalPage } from "./components/pages/approval";

interface State {
  originalImage: any;
  compressedImage: any;
  setOriginalImage: any;
  setCompressedFiles: any;
  file: any;
  fileList: any;
  setFile: any;
  setOptions: any;
  setFileList: any;
  permissions: Array<string>;
  options: {
    size?: number;
    image?: string;
    width?: number;
    height?: number;
    convertTypes?: string;
    convertSize?: number;
    originalHeight?: number;
    originalWidth?: number;
    compressedHeight?: number;
    compressedWidth?: number;
  };
}
const queryClient = new QueryClient();
export const CompressContext = createContext<State>({
  originalImage: undefined,
  compressedImage: undefined,
  setOriginalImage: undefined,
  setCompressedFiles: undefined,
  file: undefined,
  fileList: undefined,
  setFile: undefined,
  setFileList: undefined,
  setOptions: undefined,
  permissions: [],
  options: {
    size: 1000,
    image: "",
    height: 0,
    width: 0,
    compressedHeight: 0,
    compressedWidth: 0,
    originalHeight: 0,
    originalWidth: 0,
    convertSize: 500000,
    convertTypes: "image/png",
  },
});

function App() {
  const [originalImage, setOriginalImage] = useState();
  const [compressedImage, setCompressedFiles] = useState();
  const [options, setOptions] = useState({});
  const [file, setFile] = useState();
  const [fileList, setFileList] = useState();
  const [permissions, setPermissions] = useState([] as any);

  useEffect(() => {
    if (localStorage.getItem("***")) {
      const userDetails = JSON.parse(localStorage.getItem("***") as string);
      if (Array.isArray(userDetails?.userRole?.permissions)) {
        const permissions = userDetails?.userRole?.permissions?.map(
          (x) => x.name
        );
        setPermissions(permissions);
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CompressContext.Provider
        value={{
          originalImage,
          compressedImage,
          setCompressedFiles,
          setOriginalImage,
          file,
          setFile,
          options,
          setOptions,
          fileList,
          setFileList,
          permissions,
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Auth />} />
            {permissions?.includes("VIEW_DOCUMENT") ? (
              <Route path="/documents" element={<DocumentsPage />} />
            ) : (
              ""
            )}
            {permissions?.includes("VIEW_USER") ? (
              <Route path="/users" element={<UsersPage />} />
            ) : (
              ""
            )}
            {permissions?.includes("VIEW_ROLE") ? (
              <Route path="/roles" element={<Roles />} />
            ) : (
              ""
            )}
            {permissions?.includes("APPROVE_DOCUMENT") ? (
              <Route path="/approval" element={<ApprovalPage />} />
            ) : (
              ""
            )}
          </Routes>
        </BrowserRouter>
      </CompressContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
