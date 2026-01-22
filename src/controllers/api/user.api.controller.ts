import UserService from "../../services/user.service";

class UserAPIController {
    static async index(req: any, res: any) {
        try {
            const users = await UserService.getAllUsers();
            res.render("users/list.ejs", { users, userLogin: req.session.userLogin });
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Lỗi máy chủ nội bộ");
        }
    }

    static async findByID(req: any, res: any): Promise<any> {
        try {
            const {id} = req.params;
            const user = await UserService.findUseById(parseInt(id));
            if(!user) {
                return res.json({status:'not found', message: 'Không tìm thấy người dùng'});
            }
            return res.json({status:'success', data: user});
        }catch (err: any) {
            return res.json({status:'error', message: err.message});
        }
    }

    static async delete(req: any, res: any) {
        try {
           await UserService.deleteUser(req.params.id, req);
           return res.json({status:'success', message: 'Đã xóa người dùng'});
        }catch (err: any) {
            return res.json({status:'error', message: err.message});
        }
    }
}

export default UserAPIController;