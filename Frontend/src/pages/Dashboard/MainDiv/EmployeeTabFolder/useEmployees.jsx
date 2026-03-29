import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createuser, fetchEmployees, sendPassword, updateManager, updateRole } from "./Handler";
import { Toaster } from "../../../../utils/Toaster";

export default function useEmployees() {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ["users"],
        queryFn: fetchEmployees
    });

    const sendPasswordMutation = useMutation({
        mutationFn: sendPassword,
        onSuccess: () => {
            Toaster({ title: "Password Sent Successfully", status: "success" })
            queryClient.invalidateQueries(["users"]);
        }
    });

    const createuserMutation = useMutation({
        mutationFn: ({ formData }) => createuser(formData),
        onSuccess: () => {
            Toaster({ title: "Employee Created Successfully", status: "success" })
            queryClient.invalidateQueries(["users"]);
        }
    });

    const updateRoleMutation = useMutation({
        mutationFn: ({ id, role }) => updateRole(id, role),
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
            Toaster({ title: "Role Updated Successfully", status: "success" })
        }
    });

    const updateManagerMutation = useMutation({
        mutationFn: ({ id, managerId }) => updateManager(id, managerId),
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
            Toaster({ title: "Manager Updated Successfully", status: "success" })
        }
    });
    const handlerRoleChange = (id, role) => {
        updateRoleMutation.mutate({ id, role })
    }
    const handleManagerChange = (id, managerId) => {
        updateManagerMutation.mutate({ id, managerId })
    }
    return {
        users: data || [],
        isLoading,
        queryClient: queryClient,
        error,
        sendPassword: sendPasswordMutation.mutate,
        sending: sendPasswordMutation.isPending,
        createuser: createuserMutation.mutate,
        creating: createuserMutation.isPending,
        updateRole: updateRoleMutation.mutate,
        updatingRole: updateRoleMutation.isPending,
        updateManager: updateManagerMutation.mutate,
        updatingManager: updateManagerMutation.isPending,
        handlerRoleChange,
        handleManagerChange
    };
}