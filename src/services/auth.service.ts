import { User } from "@entities/User";
import { Role } from "@entities/Role";
import { AppDataSource } from "@database/data-source";
const userRepository = AppDataSource.getRepository(User);
<<<<<<< Updated upstream
const roleRepository = AppDataSource.getRepository(Role);
=======
>>>>>>> Stashed changes

class AuthService {
    static async registerUser(data: any): Promise<any> {
        const { email, password, roleId } = data;
        const u: User = new User();
        u.email = email;
        u.password = password;
        u.isActive = true;
<<<<<<< Updated upstream
        // use DataMaper
        const roleUser : any = await roleRepository.findOne({
            where: {
                id: 2
            }
        })
        if (roleUser) {
            u.role = roleUser;
        }
=======
        u.roleId = roleId; // Ensure roleId is set
>>>>>>> Stashed changes
        await userRepository.save(u);
    }

    static async checkAccount(data: any): Promise<any> {
        const { email, password } = data;
        const user = await userRepository.findOne({
            where: {
                email: email,
                password: password
            },
            relations: {
                role: true
            }
        });
        return user;
    }
}

export default AuthService;