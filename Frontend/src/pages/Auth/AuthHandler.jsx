import { useAuthStore } from "../../app/store";
import API from "../../services/api/axiosInstance";
const { user, roleRoute } = useAuthStore.getState();
export const loginUser = async (formData, setAuth, navigate) => {
    const res = await API.post("/users/signin", formData);
    setAuth(res.data.user, res.data.company);
    console.log(res.data.user, roleRoute)
    console.log(roleRoute[res.data.user.role])
    navigate(roleRoute[res.data.user.role]);
    return res;
}

export const signUpUser = async (formData, navigate) => {
    const res = await API.post("/users/signup", formData);

    navigate("/login");
    return res;
}