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
        const { email, password } = req.body;
        // Kiểm tra dữ liệu đầu vào
        if (!email || !password) {
            (req as any).flash('error', 'Vui lòng điền đầy đủ email và mật khẩu.');
            return res.redirect('/register');
        }

        // Đăng ký người dùng
        await AuthService.registerUser(req.body);

        // Gửi email cảm ơn
        const emailContent = `
            <h1>Chào mừng tới website!</h1>
            <p>Cảm ơn bạn đã tạo tài khoản trên website của chúng tôi. Chúng tôi rất vui mừng chào đón bạn!</p>
            <p>Nếu bạn có bất kỳ câu hỏi nào, hãy liên hệ với chúng tôi qua email support@example.com.</p>
        `;

        await sendEmail(req.body.email, "Chào mừng bạn đến với website của chúng tôi!", emailContent);

        (req as any).flash('success', 'Đăng ký thành công! Vui lòng đăng nhập.');
        // Chuyển hướng đến trang đăng nhập
        res.redirect('/login');
    } catch (error: any) {
        console.error("Error during registration:", error);
        // Thông báo lỗi cụ thể (ví dụ: Email đã tồn tại)
        (req as any).flash('error', error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        res.redirect('/register');
    }
    }

    static async login(req: any, res: Response) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                req.flash('error', 'Vui lòng nhập email và mật khẩu.');
                return res.redirect('/login');
            }
            const account = await AuthService.checkAccount(req.body);
            if (!account) {
                req.flash('error', 'Email hoặc mật khẩu không đúng.'); // Gửi thông báo lỗi
                return res.redirect('/login'); // Quay lại trang đăng nhập nếu thông tin không hợp lệ
            }
    
            // Lưu thông tin người dùng vào session
            req.session.userLogin = {
                id: account.id,
                email: account.email,
                roleId: account.roleId,
            };

            // Lưu session trước khi redirect để đảm bảo không bị mất phiên
            req.session.save((saveErr: any) => {
                if (saveErr) {
                    console.error("Session save error:", saveErr);
                    return res.status(500).send("Lỗi lưu phiên đăng nhập");
                }

                // Chuyển hướng dựa trên roleId (Dùng 303 để ép buộc trình duyệt dùng GET)
                if (account.roleId === 1) {
                    return res.redirect(303, '/home'); 
                } else if (account.roleId === 2) {
                    return res.redirect(303, '/front'); 
                } else {
                    return res.redirect(303, '/login'); 
                }
            });
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).send("Lỗi máy chủ nội bộ");
        }
    }

    static logout(req: Request, res: Response) {
        req.session.destroy((err) => {
            if (err) console.error("Logout error:", err);
            res.clearCookie('connect.sid'); // Xóa cookie session trên trình duyệt
            res.redirect('/login'); // Chuyển hướng về trang đăng nhập
        });
    }
}

export default AuthController;