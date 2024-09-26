//UTILITES.JSX CONTAINS TOKEN AUTHENTICATION FUNCTIONS THAT SPEAK TO THE DJANGO USER VIEWS TO CREATE USERS OR VERIFY USER AUTHENTICATION

import axios from "axios";

//AN AXIOS INSTANCE HOLDS THE BASE URL USED THROUGHOUT THE APPLICATION.
export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/",
  withCredentials: true,
});

export const userRegistration = async (email, password) => {
  let response = await api.post("users/signup/", {
    email: email,
    password: password,
  });
  if (response.status === 201) {
    let { user, token } = response.data;
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Token ${token}`;
    return user;
  }
  alert(response.data);
  return null;
};

export const userLogIn = async (email, password) => {
  let response = await api.post("users/login/", {
    email: email,
    password: password,
  });
  if (response.status === 200) {
    let { user, token } = response.data;
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Token ${token}`;
    console.log(`${user} logged in`);
    return user;
  }
  alert(response.data);
  return null;
};

export const userLogOut = async () => {
  let response = await api.post("users/logout/");
  if (response.status === 204) {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    return null;
  }
  alert("Something went wrong and logout failed");
};

export const userConfirmation = async () => {
  let token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Token ${token}`;
    let response = await api.get("users/info/");
    if (response.status === 200) {
      return response.data.user;
    }
  }
  return null;
};
