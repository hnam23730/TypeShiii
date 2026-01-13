import { Request,NextFunction, Response } from "express";

export const checkAuth = (req: any, res: Response, next: NextFunction) => {
    if (!req.session || !req.session.userLogin) {
        if (req.originalUrl === "/shoping-cart/add") {
            // Nếu người dùng cố gắng thêm sản phẩm vào giỏ hàng, chuyển hướng đến trang đăng ký
            res.status(200).json({ success: false, message: "Bạn cần đăng nhập để mua sản phẩm." });
            return;
        }
        return res.redirect('/login'); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    }
    res.locals.userLogin = req.session.userLogin; // Truyền thông tin userLogin vào res.locals
    next();
};
