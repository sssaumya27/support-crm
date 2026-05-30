import axios from "axios";

const API = axios.create({
  baseURL: "https://support-crm-gmyf.onrender.com"
});

export default API;