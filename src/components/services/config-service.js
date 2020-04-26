import axios from 'axios';

export const getConfig = () => {
  return axios.get('http://localhost:3001/config').then((res) => {
    return res.data;
  });
};

export const updateConfig = config => {
  return axios.put('http://localhost:3001/config', config);
};
