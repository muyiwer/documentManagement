import { useCallback, useState } from "react";
import { useMutation, MutationFunction } from "@tanstack/react-query";
import { Notify } from "../components/notification";
import { APIResponse, LoginResponse } from "../model";

export const useApi = (
  page: "login" | "users" | "documents" | "roles" | "department"
) => {
  const [payload, setPayload] = useState({} as any);
  const [ID, setID] = useState(0);
  const [response, setResponse] = useState([] as any);
  const [response2, setResponse2] = useState([] as any);
  const [dataSource, setDataResponse] = useState([] as any);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const domain = "https://dms-app-z844.onrender.com/api/v1/";
  const createPost: MutationFunction<any, any> = async (request) => {
    let token: string | undefined = undefined;
    if (localStorage.getItem("***")) {
      const details = JSON.parse(
        localStorage.getItem("***") as string
      ) as LoginResponse;
      token = details.accessToken;
    }
    const response = await fetch(`${domain}${request.url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(request.payload),
    });

    if (!response.ok) {
      console.error("Sorry, Error occured on the server");
    }
    setLoading(false);
    return response.json();
  };

  const mutation = useMutation(createPost, {
    onSuccess: (data: APIResponse) => {
      //queryClient.invalidateQueries("posts");
      console.log("dddd");
      if (data.responseCode === "0") {
        const result = data.data;
        if (page === "login") {
          localStorage.setItem("***", JSON.stringify(result));
          if (Array.isArray(result?.userRole?.permissions)) {
            const permissions = result?.userRole?.permissions?.map(
              (x) => x.name
            );
            if (permissions?.includes("VIEW_DOCUMENT")) {
              window.location.href = "/documents";
            } else if (permissions?.includes("VIEW_USER")) {
              window.location.href = "/users";
            } else if (permissions?.includes("VIEW_ROLE")) {
              window.location.href = "/roles";
            } else if (permissions?.includes("APPROVE_DOCUMENT")) {
              window.location.href = "/approval";
            } else {
              Notify(
                "It seems the Admin have not set permission for you to access this app. Contact the admin.",
                false
              );
            }
          } else {
            Notify(
              "It seems the Admin have not set permission for you to access this app. Contact the admin.",
              false
            );
          }
        } else if (page === "users") {
          setDataResponse(result?.users);
        } else if (page === "roles") {
          setDataResponse(result?.roles);
        } else if (page === "documents") {
          setDataResponse(result?.documents);
        } else if (page === "department") {
          setDataResponse(result?.departments);
        }
      } else if (data.responseCode === "97") {
        localStorage.clear();
        window.location.href = "/";
      } else {
        Notify(data.responseMessage, false);
      }
      setLoading(false);
    },
    onError: () => {
      Notify("Sorry, Error occured on the server", false);
      setLoading(false);
    },
  });
  const mutationForCreateData = useMutation(createPost, {
    onSuccess: (data: APIResponse) => {
      //queryClient.invalidateQueries("posts");
      if (data.responseCode === "0") {
        Notify(data.responseMessage, true);
        setShowModal(false);
        if (page === "roles") {
          postData(undefined, "adminRoles", { page: 0, size: 100 });
        } else if (page === "users") {
          postData(undefined, "users", { page: 0, size: 100 });
        } else if (page === "documents") {
          postData(undefined, "documents", { page: 0, size: 100 });
        }
        else if (page === "department") {
          postData(undefined, "dept", { page: 0, size: 100 });
        }
      } else if (data.responseCode === "97") {
        localStorage.clear();
        setShowModal(false);
        window.location.href = "/";
      } else {
        Notify(data.responseMessage ?? data.error, false);
      }
      setLoading(false);
    },
    onError: () => {
      Notify("Sorry, Error occured on the server", false);
      setLoading(false);
    },
  });
  const mutationForSelectOption = useMutation(createPost, {
    onSuccess: (data: APIResponse) => {
      //queryClient.invalidateQueries("posts");
      if (data.responseCode === "0") {
        const result = data.data;
        if(result.departments){
          setResponse2(result)
        }else{
          setResponse(result);
        }
      } else if (data.responseCode === "97") {
        localStorage.clear();
        window.location.href = "/";
      } else {
        Notify(data.responseMessage, false);
      }
      setLoading(false);
    },
    onError: () => {
      Notify("Sorry, Error occured on the server", false);
      setLoading(false);
    },
  });

  const postData = useCallback(
    (event: any | undefined, url: string, payload: any) => {
      if (event) event.preventDefault();
      setLoading(true);
      mutation.mutate({
        url,
        payload,
      });
    },
    [mutation]
  );

  const postPayload = useCallback(
    (url: string, payload: any) => {
      setLoading(true);
      mutationForCreateData.mutate({
        url,
        payload,
      });
    },
    [mutationForCreateData]
  );

  const postOptionData = useCallback(
    (event: any | undefined, url: string, payload: any) => {
      if (event) event.preventDefault();
      setLoading(true);
      mutationForSelectOption.mutate({
        url,
        payload,
      });
    },
    [mutationForSelectOption]
  );

  const setRequest = (key: string, value: any) => {
    if (key === "roleId") {
      const roleName = response?.roles?.filter((x) => x.id === value)[0]!.name;
      setPayload({ ...payload, [key]: value, roleName });
    }
    else if(key === "departmentId"){
      const departmentName = response2?.departments?.filter((x) => x.id === value)[0]!.name;
      setPayload({ ...payload, [key]: value, departmentName });
    }
     else {
      setPayload({ ...payload, [key]: value });
    }
  };

  return {
    postData,
    setRequest,
    payload,
    mutation,
    response,
    response2,
    loading,
    dataSource,
    postOptionData,
    postPayload,
    setResponse,
    showModal,
    setShowModal,
    setPayload,
    ID,
    setID,
  };
};
