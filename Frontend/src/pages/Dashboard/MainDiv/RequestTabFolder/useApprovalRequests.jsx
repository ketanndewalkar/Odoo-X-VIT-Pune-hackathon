import { useQuery } from "@tanstack/react-query";
import { fetchApprovalRequests } from "./handler";

export default function useApprovalRequests() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["approvalRequests"],
        queryFn: fetchApprovalRequests
    });

    return {
        requests: data || [],
        isLoading,
        error
    };
}