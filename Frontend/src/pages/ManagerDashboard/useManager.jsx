import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchManagerRequests, updateRequestStatus } from "./handler";
import { Toaster } from "../../utils/Toaster";

export default function useManager() {
    const queryClient = useQueryClient();

    const { data: requests, isLoading, error } = useQuery({
        queryKey: ["managerRequests"],
        queryFn: fetchManagerRequests
    });

    const approveMutation = useMutation({
        mutationFn: (id) => updateRequestStatus({ id, status: "Approved" }),
        onSuccess: () => {
            Toaster({ title: "Request Approved", status: "success" });
            queryClient.invalidateQueries(["managerRequests"]);
        },
        onError: () => {
            Toaster({ title: "Failed to approve request", status: "error" });
        }
    });

    const rejectMutation = useMutation({
        mutationFn: (id) => updateRequestStatus({ id, status: "Rejected" }),
        onSuccess: () => {
            Toaster({ title: "Request Rejected", status: "success" });
            queryClient.invalidateQueries(["managerRequests"]);
        },
        onError: () => {
            Toaster({ title: "Failed to reject request", status: "error" });
        }
    });

    return {
        requests: requests || [],
        isLoading,
        error,
        approveRequest: approveMutation.mutate,
        isApproving: approveMutation.isPending,
        rejectRequest: rejectMutation.mutate,
        isRejecting: rejectMutation.isPending
    };
}
