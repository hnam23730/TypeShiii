import { Request, Response } from 'express';
import AuthService from '@services/auth.service';
import { sendEmail } from "../services/email.service";

class AuthController {
    static showFormRegister(req: Request, res: Response) {
        res.render('auth/register.ejs');
    }

    static showFormLogin(req: Request, res: Response) {
        res.render('auth/login.ejs');
    }

    
    static async register(req: Request, res: Response) {
    try {
        // Đăng ký người dùng
        await AuthService.registerUser(req.body);

        // Gửi email cảm ơn
        const emailContent = `
            <h1>Welcome to Our Website!</h1>
            <p>Thank you for creating an account on our website. We're excited to have you on board!</p>
            <p>If you have any questions, feel free to contact us at support@example.com.</p>
        `;

        await sendEmail(req.body.email, "Welcome to Our Website!", emailContent);

        // Chuyển hướng đến trang đăng nhập
        res.redirect('/login');
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send("Internal Server Error");
    }
    }

    static async login(req: any, res: Response) {
        try {
            const account = await AuthService.checkAccount(req.body);
            if (!account) {
                return res.redirect('/login'); // Quay lại trang đăng nhập nếu thông tin không hợp lệ
            }
    
            // Lưu thông tin người dùng vào session
            req.session.userLogin = {
                id: account.id,
                email: account.email,
                roleId: account.roleId,
            };
    
            // Chuyển hướng dựa trên roleId
            if (account.roleId === 1) {
                return res.redirect('/home'); // Admin
            } else if (account.roleId === 2) {
                return res.redirect('/front'); // Người dùng
            } else {
                return res.redirect('/login'); // Trường hợp khác
            }
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static logout(req: Request, res: Response) {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    }
}

export default AuthController;