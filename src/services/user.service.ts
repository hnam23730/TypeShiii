import { User } from "@entities/User";
import { Role } from "@entities/Role";
import { AppDataSource } from "@database/data-source";
const userRepository = AppDataSource.getRepository(User);

class UserService {
    static async getAllRoles(): Promise<Role[]> {
        return await AppDataSource.getRepository(Role).find();
    }
    static findById(userId: string) {
        throw new Error("Method not implemented.");
    }
    static async getAllUsers(): Promise<any> {
        return await AppDataSource.getRepository(User).find({ relations: ["role"] });
    }

    static async getUserById(id: number): Promise<any | null> {
        return await AppDataSource.getRepository(User).findOne({ where: { id }, relations: ["role"] });
    }
    static async findUseById(id: number): Promise<any> {
        return await userRepository.findOne({
            where: {
                id: id
            },
            relations: {
                role: true
            }
        });
    }

    static async createUser(userData: Partial<User>): Promise<User> {
        const user = AppDataSource.getRepository(User).create(userData);
        return await AppDataSource.getRepository(User).save(user);
    }

    static async updateUser(id: number, userData: Partial<User>): Promise<any> {
        return await AppDataSource.getRepository(User).update(id, userData);
    }

    static async deleteUser(id: number, req: any): Promise<any> {
        const user = await AppDataSource.getRepository(User).findOne({ where: { id } });
        if (!user) {
            throw new Error("User not found.");
        }
        return await AppDataSource.getRepository(User).delete(id);
    }
}

export default UserService;