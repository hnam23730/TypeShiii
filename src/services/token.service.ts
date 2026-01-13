import { AppDataSource } from "@database/data-source";
import { Token } from "@entities/Token";
import { User } from "@entities/User";
const tokenRepository = AppDataSource.getRepository(Token);
import { v4 as uuidv4 } from 'uuid';
import UserService from "./user.service";

class TokenService {
    static async getAllTokens(req: any, res: any): Promise<any> {
        const { userLogin } = req.session;
        return await tokenRepository.find({
            where: {
                user: {
                    id: userLogin.id
                }
            }
        });
    }

    static async createToken(data: any, req: any): Promise<any> {
        const { userLogin } = req.session;
        const { keyName } = data;
        const newToken = new Token();
        newToken.name = keyName;
        newToken.key = uuidv4();
        newToken.status = "active";
        const user = await UserService.findUseById(userLogin.id);
        newToken.user = user;
        await tokenRepository.save(newToken);
    }

    static async findTokenByKey(key: any): Promise<any> {
        return await tokenRepository.findOne({
            where: {
                key: key
            }
        });
    }

    static async updateTokenName(id: number, newName: string): Promise<any> {
        await tokenRepository.update(id, { name: newName });
    }

    static async updateTokenStatus(id: number, newStatus: string): Promise<any> {
        await tokenRepository.update(id, { status: newStatus });
    }

    static async deleteToken(id: number): Promise<any> {
        return await tokenRepository.delete(id);
    }
}

export default TokenService;