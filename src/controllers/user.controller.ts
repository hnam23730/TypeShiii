import RoleService from "@services/role.service";
import UserService from "@services/user.service";
import RoleService from "@services/role.service";
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
                return res.status(400).send("All fields are required.");
            }
    
            await UserService.createUser({ email, password, roleId });
            res.redirect("/users");
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async showEditForm(req: any, res: any) {
        try {
            const user = await UserService.getUserById(parseInt(req.params.id));
            if (!user) {
                return res.status(404).send("User not found.");
            }
    
            const roles = await UserService.getAllRoles(); // Giả sử bạn có hàm lấy danh sách vai trò
            res.render("users/edit.ejs", { userEdit: user, roles, userLogin: req.session.userLogin });
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async update(req: any, res: any) {
        try {
            const { email, roleId } = req.body;
    
            if (!email || !roleId) {
                return res.status(400).send("All fields are required.");
            }
    
            await UserService.updateUser(parseInt(req.params.id), { email, roleId });
            res.redirect("/users");
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async delete(req: any, res: any) {
        try {
            const userId = parseInt(req.params.id);
    
            if (isNaN(userId)) {
                return res.status(400).send("Invalid user ID.");
            }
    
            if (!req.session.userLogin) {
                return res.status(401).send("Unauthorized: User not logged in.");
            }
    
            if (req.session.userLogin.id === userId) {
                return res.status(403).send("You cannot delete your own account.");
            }
    
            await UserService.deleteUser(userId, req);
            res.redirect("/users");
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async showFormCreate(req: any, res: Response) {
        const roles = await RoleService.getAllRoles();
        res.render('users/create.ejs', {roles: roles});
    }

    static async createUser(req: any, res: Response) {
        await UserService.store(req.body);
        res.redirect('/users');
    }

    static async showFormEdit(req: any, res: Response) {
        const roles = await RoleService.getAllRoles();
        const userEdit = await UserService.findUseById(req.params.id);
        console.log(userEdit);
        res.render('users/edit.ejs', {roles: roles, userEdit: userEdit});
    }

    static async editUser(req: any, res: Response) {
        await UserService.edit(req.params.id, req.body);
        res.redirect('/users');
    }
}

export default UserController;