import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api', //'https://realtime-quiz.fly.dev/api'
  headers: {
    'Content-Type': 'application/json',
  },
});

interface LoginData {
  email: string;
  password: string;
}

interface MeData {
  accessToken: string;
}

interface RegisterData {
  email: string;
  password: string;
  display_name: string;
}

const login = async (data: LoginData) => {
  try {
    const response = await apiClient.post('/login', JSON.stringify(data));
    console.log(response);
    return response.data; // Assuming you want to return the data property of the response
  } catch (error) {
    throw error;
  }
};

const me = async (data: MeData) => {
  try {
    apiClient.defaults.headers['Authorization'] = `Bearer ${data.accessToken}`;
    const response = await apiClient.get('/me');
    return response.data; // Assuming you want to return the data property of the response
  } catch (error) {
    throw error;
  }
};

const register = async (data: RegisterData) => {
  try {
    const response = await apiClient.post('/register', JSON.stringify(data));
    return response.data; // Assuming you want to return the data property of the response
  } catch (error) {
    throw error;
  }
};

//add interceptor to add token to header
apiClient.interceptors.request.use(
  config => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.accessToken) {
      config.headers['Authorization'] = `Bearer ${user.accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

const createSession = async (data: any) => {
  try {
    console.log(data);
    const response = await apiClient.post('/session', JSON.stringify(data));
    return response.data; // Assuming you want to return the data property of the response
  } catch (error) {
    throw error;
  }
};

const disconnectSession = async (data: any) => {
  try {
    console.log(data);
    const response = await apiClient.post(
      '/session/disconnect',
      JSON.stringify(data),
    );
    return response.data; // Assuming you want to return the data property of the response
  } catch (error) {
    throw error;
  }
};

const joinSession = async (data: any) => {
  try {
    //i need to add the roomkey to the url as param, roomkey is in data.roomkey
    console.log(data.roomKey);
    const response = await apiClient.post(
      `/session/join/${data.roomKey}`,
      JSON.stringify(data),
    );
    return response.data; // Assuming you want to return the data property of the response
  } catch (error) {
    throw error;
  }
};

export default {
  login,
  me,
  register,
  createSession,
  joinSession,
  disconnectSession,
};
