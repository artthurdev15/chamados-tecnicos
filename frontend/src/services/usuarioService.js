import api from './api'

const usuarioService = {
  listarTodos: async () => {
    const response = await api.get('/usuarios')
    return response.data
  },

  salvar: async (usuarioData) => {
    const response = await api.post('/usuarios', usuarioData)
    return response.data
  },

  excluir: async (id) => {
    await api.delete(`/usuarios/${id}`)
  }
}

export default usuarioService