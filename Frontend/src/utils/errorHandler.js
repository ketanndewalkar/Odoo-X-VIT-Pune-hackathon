import { Toaster } from "./Toaster";

export const errorHandler = (err) => {
    console.log(err)
    if(err.message == "Network Error"){
        Toaster({title:"Network Error",status:"error"})
    }else{
    Toaster({title:err?.response?.data?.message || "Something went wrong",status:"error"})
    }
};