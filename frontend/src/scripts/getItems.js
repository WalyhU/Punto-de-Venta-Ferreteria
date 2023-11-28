const token = localStorage.getItem("token");
const API = process.env.REACT_APP_FERRETERIA_API;
export const getItems = async (item) => {
  const response = await fetch(`${API}/${item}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};
