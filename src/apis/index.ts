import axios from "axios";

const serverUrl = "https://api.life-sui.com"
// const serverUrl = "http://localhost:3001/"

export const generateIcons = async (data: { prompt: string, style: string, colors: string[] }) => {
    const response = await axios.post(serverUrl + '/api/generate', data);
    return response.data
}