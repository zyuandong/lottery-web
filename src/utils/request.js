import Axios from 'axios';

const axiosInstance = Axios.create({
  baseURL: '/lottery_service_api',
});

export default axiosInstance;
