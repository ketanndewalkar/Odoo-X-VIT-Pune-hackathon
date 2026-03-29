import API from "../../services/api/axiosInstance";

export const fetchManagerRequests = async () => {
  const { data } = await API.get("/approval-requests/manager-requests"); // Assuming this endpoint handles manager requests
  // Alternatively using the mock for now if endpoint isn't ready
  return data?.requests || data || [];
};

export const updateRequestStatus = async ({ id, status }) => {
  const { data } = await API.put(`/approval-requests/${id}/status`, { status });
  return data;
};
