/* eslint-disable @typescript-eslint/no-explicit-any */
import { SERVER_URL } from "./serverURL";

import axios from "axios";

const Axios = axios.create({
  baseURL: `${SERVER_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});



export const LoginAPI = async (reqBody: any) => {
  try {
    console.log(reqBody, "okkkk");
    const response = await Axios.post(`${SERVER_URL}/login`, reqBody);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("API call error:", error);

    let errorMessage = "An unexpected error occurred. Please try again.";
    if (error.response && error.response.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

type RequestHeaders = Record<string, string>;
export const SignupAPI = async (reqBody: any, reqHeader?: RequestHeaders) => {
  try {
    const response = await Axios.post(`${SERVER_URL}/signup`, reqBody, reqHeader);
    return response.data;
  } catch (error: any) {
    console.error("API call error:", error);
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("An unexpected error occurred. Please try again.");
    }

  }
};


export const saveChat = async (chatData: {
  user_id: string;
  message: string;
  pollOptions?: string[];
  pollVotes?: number[];
  selectedPollOption?: string;
}) => {
  try {
    console.log(chatData, 'CHAT DATA'); 

    const response = await Axios.post(`${SERVER_URL}/saveChat`, chatData);
    return response.data;
  } catch (error: any) {
    console.error('API call error:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};

export const getMessages = async () => {
  try {
    const response = await Axios.get(`${SERVER_URL}/message`);
    return response.data; // Returning just the data part
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw new Error('Failed to fetch messages'); // Rethrow the error to be caught in the component
  }
};