export function validateRegister(data) {
    const { nome, email, senha } = data;

    if (!nome || !email || !senha) {
        throw new Error('Todos os campos são obrifatórios!')
    }

    if (nome.length < 3) {
        throw new Error("Nome deve ter no mínimo 3 caracteres!")
    }

     if (!email.includes("@")) {
        throw new Error("Email inválido!")
    }

     if (senha.length < 6) {
        throw new Error("Senha deve ter no mínimo 6 caracteres!")
    }
}