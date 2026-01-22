import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from "../database/data-source";
import { Notification } from "../entities/Notification";

class NotificationController {
    static async getUnread(req: Request, res: Response, next: NextFunction) {
        try {
            const notifications = await AppDataSource.getRepository(Notification).find({
                where: { isRead: false },
                order: { createdAt: 'DESC' },
                take: 10 // Giới hạn 10 thông báo gần nhất
            });
            const unreadCount = await AppDataSource.getRepository(Notification).count({ where: { isRead: false } });
            res.json({ success: true, notifications, unreadCount });
        } catch (error) {
            next(error);
        }
    }

    static async markAsRead(req: Request, res: Response, next: NextFunction) {
        try {
            const notificationId = parseInt(req.params.id);
            const notification = await AppDataSource.getRepository(Notification).findOneBy({ id: notificationId });
            if (notification) {
                notification.isRead = true;
                await AppDataSource.getRepository(Notification).save(notification);
                res.json({ success: true });
            } else {
                res.status(404).json({ success: false, message: 'Không tìm thấy thông báo' });
            }
        } catch (error) {
            next(error);
        }
    }
}
export default NotificationController;