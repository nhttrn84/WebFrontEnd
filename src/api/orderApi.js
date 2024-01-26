import customAxios from "./customApi";

class OrderApi {
  async register(data) {
    try {
      const response = await customAxios.post(`/auth/register`, data);
      return response;
    } catch (error) {
      return error.response;
    }
  }
  async login(data) {
    try {
      const response = await customAxios.post(`/auth/login`, data);
      return response;
    } catch (error) {
      return error.response;
    }
  }
  async logout() {
    try {
      const response = await customAxios.post(`/auth/logout`, {});
      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default new OrderApi();
