import { NextFunction, Response } from "express";

export const checkAuth = (req: any, res: Response, next: NextFunction) => {
    if (!req.session || !req.session.userLogin) {
        return res.redirect('/login'); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    }
    res.locals.userLogin = req.session.userLogin; // Truyền thông tin userLogin vào res.locals
    next();
};