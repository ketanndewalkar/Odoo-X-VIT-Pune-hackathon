import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchEmployees, sendPassword } from "./Handler";

export default function useEmployees() {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ["employees"],
        queryFn: fetchEmployees
    });

    const sendPasswordMutation = useMutation({
        mutationFn: sendPassword,
        onSuccess: () => {
            queryClient.invalidateQueries(["employees"]);
        }
    });

    return {
        employees: data || [],
        isLoading,
        error,
        sendPassword: sendPasswordMutation.mutate,
        sending: sendPasswordMutation.isPending
    };
}