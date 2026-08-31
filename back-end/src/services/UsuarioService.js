import bcrypt from "bcrypt";
import crypto from "crypto";
import UserRepository from "../repositories/UserRepository.js";
import { validateRegister } from "../validators/user.validator.js";
import { generateToken, hashToken } from "../utils/emailToken.util.js";
import EmailService from "./EmailService.js";

class UsuarioService {
    
 async create(data) {
        validateRegister(data);

        const { nome, email, senha, ano_escolar, perfil } = data;

        const emailNormalizado = email.toLowerCase().trim();

        const userExists = await UserRepository.getByEmail(emailNormalizado);

        if (userExists) throw new Error("Email já cadastrado!");

        const senhaHash = await bcrypt.hash(senha, 10);
        const token = generateToken();
        const tokenHash = hashToken(token);

        const newUser = await UserRepository.create({
            nome, 
            email: emailNormalizado,
            senha: senhaHash,
            ano_escolar: ano_escolar,
            perfil: perfil,
            token_verificacao: tokenHash,
            token_expiracao: new Date(Date.now() + 1000 * 60 * 60)
        })

        const link = `http://localhost:3000/auth/verify-email?token=${token}`;

        await EmailService.send(
            emailNormalizado,
            "Verifique seu email",
            `
            <h1>Bem-Vindo!</h1>
            <p>Clique no botão abaixo para verificar seu email:</P>
            <a href="${link}">Verificar Email</a>
            `
        )

        return {
            message: "Usuário cadastrado com sucesso!",
            newUser
        }
    }
}

export default new UsuarioService();