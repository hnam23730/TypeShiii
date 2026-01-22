import { Request, Response } from 'express';
import AuthService from '../services/auth.service';
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
            <h1>Chào mừng tới website!</h1>
            <p>Cảm ơn bạn đã tạo tài khoản trên website của chúng tôi. Chúng tôi rất vui mừng chào đón bạn!</p>
            <p>Nếu bạn có bất kỳ câu hỏi nào, hãy liên hệ với chúng tôi qua email support@example.com.</p>
        `;

        await sendEmail(req.body.email, "Chào mừng bạn đến với website của chúng tôi!", emailContent);

        // Chuyển hướng đến trang đăng nhập
        res.redirect('/login');
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send("Lỗi máy chủ nội bộ");
    }
    }

    static async login(req: any, res: Response) {
        try {
            const account = await AuthService.checkAccount(req.body);
            if (!account) {
                return res.redirect('/login'); // Quay lại trang đăng nhập nếu thông tin không hợp lệ
            }
    
            // QUAN TRỌNG: Tái tạo session để xóa dữ liệu cũ và tránh xung đột
            req.session.regenerate((err: any) => {
                if (err) {
                    console.error("Session regenerate error:", err);
                    return res.status(500).send("Lỗi hệ thống khi đăng nhập");
                }

                // Lưu thông tin người dùng vào session MỚI
                req.session.userLogin = {
                    id: account.id,
                    email: account.email,
                    roleId: account.roleId,
                };

                // Lưu session trước khi redirect
                req.session.save((saveErr: any) => {
                    if (saveErr) {
                        console.error("Session save error:", saveErr);
                        return res.status(500).send("Lỗi lưu phiên đăng nhập");
                    }

                    // Chuyển hướng dựa trên roleId
                    if (account.roleId === 1) {
                        return res.redirect('/home'); // Admin
                    } else if (account.roleId === 2) {
                        return res.redirect('/front'); // Người dùng
                    } else {
                        return res.redirect('/login'); // Trường hợp khác
                    }
                });
            });
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).send("Lỗi máy chủ nội bộ");
        }
    }

    static logout(req: Request, res: Response) {
        req.session.destroy(() => {
            res.redirect('/front');
        });
    }
}

export default AuthController;