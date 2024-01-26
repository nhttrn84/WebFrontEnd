import customAxios from "./customApi";

class TransactionApi {
  async getAllTransaction() {
    try {
      const response = await customAxios.get(`/payment/transactions`);
      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default new TransactionApi();
