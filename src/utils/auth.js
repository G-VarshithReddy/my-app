// Token management utilities
export const getToken = () => {
  const token = localStorage.getItem("token");
  console.log("Retrieved token:", token);
  return token;
};

export const checkToken = () => {
  const token = localStorage.getItem("token");
  console.log("Checking token:", {
    exists: !!token,
    token: token
  });
  return !!token;
};

export const removeToken = () => {
  console.log("Removing token from localStorage");
  localStorage.removeItem("token");
};

export const setToken = (token) => {
  console.log("Setting token in localStorage:", token);
  localStorage.setItem("token", token);
}; 