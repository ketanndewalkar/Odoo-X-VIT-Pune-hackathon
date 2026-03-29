import API from "../../../../services/api/axiosInstance";
export const fetchApprovalRequests = async () => {
  const { data } = await API.get("/approval-requests");
  return data;
};