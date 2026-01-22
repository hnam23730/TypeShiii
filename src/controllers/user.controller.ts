import UserService from "../services/user.service";
import RoleService from "../services/role.service";
import { Request, Response } from "express";

class UserController {
    static async index(req: Request, res: Response) {
        const users = await UserService.getAllUsers();
        res.render('users/list.ejs', { users: users });
    }

    static showCreateForm(req: any, res: any) {
        res.render("users/create.ejs", { userLogin: req.session.userLogin });
    }
    static async create(req: any, res: any) {
        try {
            const { email, password, roleId } = req.body;
    
            if (!email || !password || !roleId) {
                return res.status(400).send("Vui lòng điền đầy đủ thông tin.");
            }
    
            await UserService.createUser({ email, password, roleId });
            res.redirect("/users");
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).send("Lỗi máy chủ nội bộ");
        }
    }

    static async showEditForm(req: any, res: any) {
        try {
            const user = await UserService.getUserById(parseInt(req.params.id));
            if (!user) {
                return res.status(404).send("Không tìm thấy người dùng.");
            }
    
            const roles = await UserService.getAllRoles(); // Giả sử bạn có hàm lấy danh sách vai trò
            res.render("users/edit.ejs", { userEdit: user, roles, userLogin: req.session.userLogin });
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).send("Lỗi máy chủ nội bộ");
        }
    }

    static async update(req: any, res: any) {
        try {
            const { email, roleId } = req.body;
    
            if (!email || !roleId) {
                return res.status(400).send("Vui lòng điền đầy đủ thông tin.");
            }
    
            await UserService.updateUser(parseInt(req.params.id), { email, roleId });
            res.redirect("/users");
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).send("Lỗi máy chủ nội bộ");
        }
    }

    static async delete(req: any, res: any) {
        try {
            const userId = parseInt(req.params.id);
    
            if (isNaN(userId)) {
                return res.status(400).send("ID người dùng không hợp lệ.");
            }
    
            if (!req.session.userLogin) {
                return res.status(401).send("Không có quyền truy cập: Người dùng chưa đăng nhập.");
            }
    
            if (req.session.userLogin.id === userId) {
                return res.status(403).send("Bạn không thể xóa tài khoản của chính mình.");
            }
    
            await UserService.deleteUser(userId, req);
            res.redirect("/users");
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).send("Lỗi máy chủ nội bộ");
        }
    }
}

export default UserController;