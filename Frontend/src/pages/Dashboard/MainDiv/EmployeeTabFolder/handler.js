import API from "../../../../services/api/axiosInstance";

export const fetchEmployees = async () => {
  const { data } = await API.get("/employees");
  return data;
};

export const sendPassword = async (id) => {
  const { data } = await API.post(`/employees/${id}/send-password`);
  return data;
};