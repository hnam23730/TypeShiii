import { Role } from "../entities/Role";
import { AppDataSource } from "../database/data-source";
const roleRepository = AppDataSource.getRepository(Role);

class RoleService {
    static async getAllRoles(): Promise<any> {
        return await roleRepository.find();
    }
}

export default RoleService;