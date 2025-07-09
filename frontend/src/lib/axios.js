import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development" ? "/api" : "/api",
	withCredentials: true, // send cookies to the server
});

export default axiosInstance;
