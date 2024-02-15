import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const getWriteList = () => {
  return axios.get(`http://localhost:3001/api/Write`)
    .then(response => response.data)
    .catch(error => console.error(error));
};

export const addWrite = (data) => {
  return axios.post(`${API_URL}/api/Write`, data)
    .then(response => response.data)
    .catch(error => console.error(error));
};