import api from "./api.js";

export const transactionService = {
  getAll: async (filters = {}) => {
    const response = await api.get("/transactions/",{params: filters});
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/transactions/", data);
    return response.data;
  },

  remove: async (id) =>{
    await api.delete(`/transactions/${id}`)
  }
};
