import { User } from "@entities/User";
import { AppDataSource } from "@database/data-source";
const userRepository = AppDataSource.getRepository(User);

class AuthService {
    static async registerUser(data: any): Promise<any> {
        const { email, password } = data;
        const roleId = 2;
        const u: User = new User();
        u.email = email;
        u.password = password;
        u.isActive = true;
        u.roleId = roleId; // Ensure roleId is set
        await userRepository.save(u);
    }

    static async checkAccount({ email, password }: { email: string; password: string }) {
        const user = await AppDataSource.getRepository(User).findOneBy({ email });

        if (!user || user.password !== password) {
            return null; // Tài khoản không hợp lệ
        }

        return user; // Trả về thông tin người dùng
    }
}

export default AuthService;