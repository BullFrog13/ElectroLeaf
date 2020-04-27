import axios from 'axios';

export const getConfig = () => axios.get('http://localhost:3001/config').then((res) => res.data);

export const updateConfig = config => axios.put('http://localhost:3001/config', config);
