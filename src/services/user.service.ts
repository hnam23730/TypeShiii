import { User } from "@entities/User";
import { AppDataSource } from "@database/data-source";
<<<<<<< Updated upstream
import { Role } from "@entities/Role";
const userRepository = AppDataSource.getRepository(User);
const roleRepository = AppDataSource.getRepository(Role);
=======
const userRepository = AppDataSource.getRepository(User);
>>>>>>> Stashed changes

class UserService {
    static getAllRoles() {
        throw new Error("Method not implemented.");
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

<<<<<<< Updated upstream
    static async store(data: any): Promise<any> {
        const {email, password, roleId} = data;
        const u: User = new User();
        u.email = email;
        u.password = password;
        u.isActive = true;
        // use DataMaper
        const roleUser : any = await roleRepository.findOne({
            where: {
                id: roleId
            }
        })
        if (roleUser) {
            u.role = roleUser;
        }
        await userRepository.save(u);
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

    static async edit(id: number, data: any): Promise<any> {
        const {email, roleId} = data;
        const currentUser = await userRepository.findOne({
            where: {
                id: id
            }, 
            relations: {
                role: true
            }
        })
        if(currentUser) {
            currentUser.email = email;
            const roleUser : any = await roleRepository.findOne({
                where: {
                    id: roleId
                }
            })
            if (roleUser) {
                currentUser.role = roleUser;
            }
            await userRepository.save(currentUser);
        }
    }

=======
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
>>>>>>> Stashed changes
}

export default UserService;