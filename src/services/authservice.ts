import api from "./api";

export const loginUser = async (
  email: string,
  password: string
) => {
  const response = await api.post(
    "/api/auth/login",  // ✅ added /
    { email, password }
  );
  return response.data;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await api.post(
    "/api/auth/register",  // ✅ added /
    { name, email, password }
  );
  return response.data;
};