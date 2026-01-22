import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Order } from "../entities/orders";
import { sendEmail } from "../services/email.service";
import { In } from "typeorm";
import ExcelJS from "exceljs";

export class OrderController {
    static async list(req: Request, res: Response) {
        try {
            const orders = await AppDataSource.getRepository(Order).find({
                order: { createdAt: "DESC" }, // Sắp xếp theo thời gian tạo
            });
            // Chuyển đổi total thành number để tránh lỗi .toFixed is not a function trong view
            const formattedOrders = orders.map(order => {
                return { ...order, total: Number(order.total) };
            });
            res.render("order/list.ejs", { orders: formattedOrders });
        } catch (error) {
            console.error("Error fetching orders:", error);
            res.status(500).send("Lỗi máy chủ nội bộ");
        }
    }

    static async update(req: Request, res: Response) {
        const { orderIds, statuses } = req.body;

        for (let i = 0; i < orderIds.length; i++) {
            const orderId = orderIds[i];
            const status = statuses[i];

            const order = await AppDataSource.getRepository(Order).findOneBy({ id: parseInt(orderId) });
            if (order) {
                // Chỉ gửi email nếu trạng thái chuyển sang Delivered và trước đó chưa phải là Delivered
                if (status === "Delivered" && order.status !== "Delivered") {
                    // Gửi email thông báo giao hàng thành công
                    await sendEmail(
                        order.customerEmail,
                        "Giao hàng thành công",
                        `<p>Chào ${order.customerName},</p><p>Đơn hàng của bạn đã được giao thành công!</p>`
                    );
                }

                // Cập nhật trạng thái đơn hàng và lưu lại (không xóa)
                order.status = status;
                await AppDataSource.getRepository(Order).save(order);
            }
        }

        res.redirect("/order");
    }

    static async exportRevenueReport(req: Request, res: Response) {
        try {
            // Lấy danh sách các đơn hàng đã hoàn thành hoặc đã giao
            const orders = await AppDataSource.getRepository(Order).find({
                where: [
                    { status: 'Completed' },
                    { status: 'Completed (VNPay)' },
                    { status: 'Delivered' }
                ],
                order: { createdAt: 'DESC' }
            });

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Báo cáo doanh thu');

            // Định nghĩa các cột
            worksheet.columns = [
                { header: 'Mã đơn hàng', key: 'id', width: 15 },
                { header: 'Khách hàng', key: 'customerName', width: 30 },
                { header: 'Email', key: 'customerEmail', width: 30 },
                { header: 'Ngày đặt', key: 'createdAt', width: 20 },
                { header: 'Trạng thái', key: 'status', width: 20 },
                { header: 'Tổng tiền ($)', key: 'total', width: 15 },
            ];

            // Thêm dữ liệu
            let totalRevenue = 0;
            orders.forEach(order => {
                worksheet.addRow({
                    ...order,
                    createdAt: order.createdAt.toISOString().split('T')[0], // Format ngày
                    total: Number(order.total)
                });
                totalRevenue += Number(order.total);
            });

            // Thêm dòng tổng cộng
            worksheet.addRow({});
            worksheet.addRow({ status: 'TỔNG DOANH THU:', total: totalRevenue });

            // Thiết lập header để trình duyệt hiểu là file tải về
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=bao-cao-doanh-thu.xlsx');

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error("Lỗi khi xuất báo cáo:", error);
            res.status(500).send("Lỗi máy chủ nội bộ khi xuất báo cáo");
        }
    }
}