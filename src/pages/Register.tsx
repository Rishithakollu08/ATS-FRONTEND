import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authservice";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const inputStyle = {
  //   padding: "14px",
  //   borderRadius: "12px",
  //   border: "1px solid #444",
  //   background: "#1f1f2b",
  //   color: "white",
  //   fontSize: "15px",
  //   outline: "none",
  //   transition: "0.3s",
  // };

  // const nameInputStyle = {
  //   ...inputStyle,
  //   background: "#252538",
  //   border: "1px solid #7c6fff",
  //   boxShadow: "0 0 8px rgba(124,111,255,0.2)",
  // };

  const handleRegister = async (e: any
  ) => {
    e.preventDefault();

    try {
      await registerUser(name, email, password);

      alert("Registration Successful! Please login.");

      navigate("/login");

    } catch (error: any) {
      alert(
        error?.response?.data?.error ||
        "Registration failed"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f0f13",
      }}
    >
      <form
        onSubmit={handleRegister}
        style={{
          width: 400,
          background: "#16161f",
          padding: 32,
          borderRadius: 16,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          border: "1px solid #2a2a3d",
          boxShadow: "0px 0px 20px rgba(0,0,0,0.5)",
        }}
      >
        <h2
          style={{
            color: "white",
            textAlign: "center",
            fontFamily: "sans-serif",
          }}
        >
          Create Account
        </h2>

        <input
          type="text"
          placeholder=" Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid  #ddd",
            background: "white",
            color: "black",
            fontSize: "15px"
          }}
        />

        <input
          type="email"
          placeholder=" Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{padding: "14px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            background: "white",
            color: "black",
            fontSize: "15px"
          }}
        />

        <input
          type="password"
          placeholder=" Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
          style={{
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            background: "white",
            color: "black",
            fontSize: "15px"
          }}
        />

        <button
          type="submit"
          style={{
            padding: 14,
            border: "none",
            borderRadius: 10,
            background: "#7c6fff",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          Register
        </button>

        <p
          style={{
            color: "#6b6b8a",
            textAlign: "center",
            fontSize: 14,
          }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#7c6fff" }}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;