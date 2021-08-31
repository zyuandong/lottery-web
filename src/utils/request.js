import Axios from 'axios';
import { ElMessage } from 'element-plus';

const axiosInstance = Axios.create({
  baseURL: '/lottery_service_api',
});

axiosInstance.interceptors.request.use(
  (config) => {
    // TODO
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axiosInstance.interceptors.response.use(
  (res) => {
    if (res.status == 200) {
      return res;
    }
    return Promise.reject(res);
  },
  (err) => {
    let { data: message, status } = err.response;

    switch (status) {
      case 404:
        message = '请求地址有误，未找到该资源！';
        break;
      case 500:
        message = '服务器错误，请联系管理员！';
        break;
      default:
        message = '抱歉，服务器出现未知的错误！';
        break;
    }

    ElMessage.error(message);

    return Promise.reject(message);
  }
);

export default axiosInstance;
