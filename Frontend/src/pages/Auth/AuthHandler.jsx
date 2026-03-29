import API from "../../services/api/axiosInstance";

export const loginUser = async (formData, setAuth, navigate) => {
    const res = await API.post("/users/signin", formData);
    setAuth(res.data);
    navigate("/");
    return res;
}

export const signUpUser = async (formData, navigate) => {
    const res = await API.post("/users/signup", formData);
    console.log(res.data);
    navigate("/login");
    return res;
}