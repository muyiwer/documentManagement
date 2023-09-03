import { useEffect } from "react";
import { useApi } from "../../hooks/useApi";

export const Auth = () => {
  const { postData, setRequest, payload, mutation } = useApi("login");
  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <section className="auth card">
      <div className="flex justify-center">
        <div className="flex flex-col">
          <img
            src="https://unilag.edu.ng/wp-content/uploads/Untitled-7-5.png"
            alt=""
          />
          <div className="flex mt-1 ml-2">
            {" "}
            <span className="text-[rgb(207,46,46)] font-extrabold text-[24px]">Document</span>{" "}
            <span className="text-red-800 font-extrabold text-[24px]">App</span>
          </div>
        </div>
      </div>
      <form
        className="flex flex-col gap-3 w-[100%]"
        onSubmit={(e) =>
          postData(e, "users/sign-in", {
            username: payload.username,
            password: payload.password,
          })
        }
      >
        <label>Username</label>
        <input
          type="text"
          className="input"
          placeholder="Enter your username"
          onChange={(e) => setRequest("username", e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          className="input"
          placeholder="Enter your password"
          onChange={(e) => setRequest("password", e.target.value)}
          required
        />
        <button
          disabled={mutation.isLoading}
          type="submit"
          className="btn btn-gradient m-10 "
        >
          {mutation.isLoading ? "Loading..." : "Login"}
        </button>
        {/* {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>} */}
      </form>
    </section>
  );
};
