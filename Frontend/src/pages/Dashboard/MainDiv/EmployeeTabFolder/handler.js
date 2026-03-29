import API from "../../../../services/api/axiosInstance";

export const fetchEmployees = async () => {
  const res = await API.get("/users/get");
  console.log(res)
  return res.data.users;
};

export const sendPassword = async (id) => {
  const { data } = await API.post(`/employees/${id}/send-password`);
  return data;
};

export const createuser = async (formData) =>{
  const res = await API.post("/users/create",formData)
  console.log(res)
  return res;
}

export const updateRole = async (id, role) => {
  const { data } = await API.put(`/users/role/${id}`, { role });
  return data;
};

export const updateManager = async (id,managerId) => {
  console.log(id,managerId)
  const { data } = await API.put(`/users/manager/${id}`, { managerId });
  return data;
};
