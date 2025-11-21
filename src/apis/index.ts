import axios from "axios";

export const generateIcons = async (data: { prompt: string, style: string, colors: string[] }) => {
    const response = await axios.post('/api/generate', data);
    return response.data
}