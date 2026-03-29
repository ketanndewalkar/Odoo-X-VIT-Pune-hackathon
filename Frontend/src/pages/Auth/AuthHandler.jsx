import API from "../../services/api/axiosInstance";

export const loginUser = async (formData, setAuth, navigate) => {
    const res = await API.post("/users/signin", formData);
    setAuth(res.data.user, res.data.company);
    navigate("/");
    return res;
}

export const signUpUser = async (formData, navigate) => {
    const res = await API.post("/users/signup", formData);

    navigate("/login");
    return res;
}