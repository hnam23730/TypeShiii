import e, { NextFunction } from "express";

export const checkPermission = (req: any, res: any, next: any) => {
    if (!req.session || !req.session.userLogin) {
        return res.status(401).send("Unauthorized: Please log in.");
    }

    const user = req.session.userLogin;
    if (!user || user.roleId !== 1) { // Giả sử chỉ Admin có quyền
        return res.status(403).send("Forbidden: You do not have permission.");
    }

    next();
};
