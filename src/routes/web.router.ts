import express, { Router, Request, Response,NextFunction } from 'express';
import HomeController from '@controllers/home.controller';
import AuthController from '@controllers/auth.controller';
import UserController from '@controllers/user.controller';
import BlogController from "../controllers/blog.controller";
import TokenController from '@controllers/token.controller';
import CategoryController from "../controllers/category.controller";
import { checkAuth } from 'src/middlewares/auth.midd';
import { checkPermission } from 'src/middlewares/permission.midd';
<<<<<<< Updated upstream
import TokenController from '@controllers/token.controller';
=======
import ProductController from "@controllers/product.controller";
import CartController from "@controllers/cart.controller";
import { AppDataSource } from "../database/data-source";
import { Product } from "../entities/Product";
import { Category } from '@entities/Catergory';
import asyncHandler from "express-async-handler";
import { createOrder, captureOrder } from '@services/paypal.service';
import OpenAI from "openai";
import { OrderController } from '@controllers/OrderController';
import { Order } from '@entities/orders';
import WishlistController from '@controllers/wishlist.controller';

>>>>>>> Stashed changes

const router: Router = express.Router();
const fetch = require('node-fetch');
const sendMessage = (recipientId: string, message: string) => {
    const PAGE_ACCESS_TOKEN = "EAAJNNz6KRDcBOZBNbd5E8bbJIdeGhYdAgJicR5h3c8E3xEhcf3p8RmZCcBbLFEOc5mVZCANmqFaXoHbOgGdWV4LHZBjXJXnqWj9fRqkPcuhq1mP4ZAhgiw1MzhZAOoOD2Axzm5GW8HnwX5r1NNrmYHoYsgaccIqzpZCAZCQ5hW7XH5CtDijvU8b0HxXjZBAyNDkUNwwn9cdt8CH0vgFNpmgZDZD";

    const requestBody = {
        recipient: {
            id: recipientId,
        },
        message: {
            text: message,
        },
    };

    fetch(`https://graph.facebook.com/v17.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
    })
};
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Thêm API key vào file .env
})

router.use((req, res, next) => {
    const shopingCart = (req.session as any).shopingCart || [];
    const totalQuantity = shopingCart.reduce((sum: number, item: any) => sum + item.quantity, 0);

    // Truyền số lượng sản phẩm vào tất cả các view
    res.locals.cartQuantity = totalQuantity;
    next();
});
router.use((req, res, next) => {
    const shopingCart = (req.session as any).shopingCart || [];
    const wishlist = (req.session as any).wishlist || [];

    const totalQuantity = shopingCart.reduce((sum: number, item: any) => sum + item.quantity, 0);

    // Truyền số lượng sản phẩm vào tất cả các view
    res.locals.cartQuantity = totalQuantity;
    res.locals.wishlistCount = wishlist.length; // Tính số lượng sản phẩm trong wishlist
    next();
});
router.get("/webhook", (req: Request, res: Response) => {
    const VERIFY_TOKEN = process.env.MY_TOKEN;
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

router.post("/webhook", (req: Request, res: Response) => {
    const body = req.body;
    
    if (body.object === "page") {
        body.entry.forEach((entry: any) => {
            const webhookEvent = entry.messaging[0];
            console.log("Webhook event:", webhookEvent);

            const senderId = webhookEvent.sender.id;
            const message = webhookEvent.message.text;

            // Gửi phản hồi lại Messenger
            sendMessage(senderId, "Cảm ơn bạn đã nhắn tin! Chúng tôi sẽ phản hồi sớm.");
        });

        res.status(200).send("EVENT_RECEIVED");
    } else {
        res.sendStatus(404);
    }
    console.log("Webhook POST request received:", req.body);
});


router.get("/front", async (req, res) => {
    try {
        // Fetch products from the database
        const products = await AppDataSource.getRepository(Product).find();

        // Use res.locals.userLogin instead of req.session.userLogin
        const userLogin = res.locals.userLogin;

        // Render the front.ejs view and pass the products
        res.render("frontpage/front.ejs", { products, userLogin });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/", (req, res) => {
    res.redirect("/front");
});
router.get('/home', HomeController.index);
router.get('/home', async (req, res) => {
    const userLogin = res.locals.userLogin;
    res.render('home.ejs', { userLogin });
});
router.get('/register', AuthController.showFormRegister);
router.post('/register', AuthController.register);
router.get('/login', AuthController.showFormLogin);
router.post('/login', AuthController.login);
router.get('/users',checkAuth, UserController.index);
router.get('/users/create', checkAuth, checkPermission, UserController.showCreateForm);
router.post('/users/create', checkAuth, checkPermission, UserController.create);
router.get('/users/:id/edit', checkAuth, checkPermission, UserController.showEditForm);
router.post('/users/:id/edit', checkAuth, checkPermission, UserController.update);
router.get('/users/:id/delete',checkAuth, checkPermission, UserController.delete);
router.get('/logout', checkAuth, AuthController.logout);
<<<<<<< Updated upstream
router.get('/users/create', checkAuth, checkPermission, UserController.showFormCreate);
router.post('/users/store', checkAuth, checkPermission, UserController.createUser);
router.get('/users/:id/edit', checkAuth, checkPermission, UserController.showFormEdit);
router.post('/users/:id/edit', checkAuth, checkPermission, UserController.editUser);

router.get('/api-keys',checkAuth, TokenController.index);
router.post('/api-keys/store',checkAuth, TokenController.store);
router.get('/api-keys/:id/delete',checkAuth, TokenController.deleteToken);
router.get('/get-my-tokens', TokenController.getAllTokens)
=======
//user gì đó

router.get("/blogs", BlogController.list);
router.get("/blogs/create", BlogController.showCreateForm);
router.post("/blogs/create", BlogController.create);
router.get("/blogs/:id/edit", BlogController.showEditForm);
router.post("/blogs/:id/edit", BlogController.update);
router.post("/blogs/:id/delete", BlogController.delete);
router.get("/blog-details", (req, res) => {
    res.render("frontpage/blog-details.ejs");
});
router.get("/blog", (req, res) => {
    res.render("frontpage/blog.ejs");
});
//blog gì đó

router.get('/api-keys',checkAuth, TokenController.index);
router.post('/api-keys/store',checkAuth, TokenController.store);
router.post('/api-keys/update-name', checkAuth, TokenController.updateName);
router.post('/api-keys/update-status', checkAuth, TokenController.updateStatus);
router.get('/api-keys/:id/delete', checkAuth, TokenController.delete);
//linh tinh gì đó
router.get('/search', asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const query = req.query.query as string;

        if (!query) {
            res.json([]);
            return;
        }

        const products = await AppDataSource.getRepository(Product)
            .createQueryBuilder('product')
            .where('product.name LIKE :query', { query: `%${query}%` })
            .select(['product.id', 'product.name'])
            .getMany();

        res.json(products);
    } catch (error) {
        console.error('Error during search:', error);
        next(error); // Pass the error to the next middleware
    }
}));
router.get("/products", ProductController.list);
router.get("/products/create", ProductController.showCreateForm);
router.post("/products/create", ProductController.create);
router.get("/products/:id/edit", ProductController.showEditForm);
router.post("/products/:id/edit", ProductController.update);
router.get("/products/:id/delete", ProductController.delete);
//san phẩm gì đó

router.get("/categories", CategoryController.list);
router.get("/categories/create", CategoryController.showCreateForm);
router.post("/categories/create", CategoryController.create);
router.get("/categories/:id/edit", CategoryController.showEditForm);
router.post("/categories/:id/edit", CategoryController.update);
router.post("/categories/:id/delete", CategoryController.delete);
//danh mục gì đó
router.get("/order", OrderController.list);
router.post("/order/update", OrderController.update);

router.get('/wishlist', WishlistController.viewWishlist);
router.post('/wishlist/add', WishlistController.addToWishlist);
router.post('/wishlist/remove', WishlistController.removeFromWishlist);
router.post('/wishlist/buy', WishlistController.buyFromWishlist);


router.get("/shoping-cart", async (req, res) => {
    try {
        // Lấy giỏ hàng từ session
        const shopingCart = (req.session as any).shopingCart || [];

        shopingCart.forEach((product: any) => {
            product.price = parseFloat(product.price); // Chuyển đổi `price` thành số
        });
        // Tính tổng số tiền
        let total = 0;
        shopingCart.forEach((product: any) => {
            total += product.price * product.quantity;
        });

        // Render view và truyền dữ liệu
        res.render("frontpage/shoping-cart.ejs", { shopingCart, total });
    } catch (error) {
        console.error("Error fetching shoping cart:", error);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/shoping-cart/data", (req, res) => {
    try {
        const shopingCart = (req.session as any).shopingCart || [];
        const total = shopingCart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
        res.json({ success: true, shopingCart, total });
    } catch (error) {
        console.error("Error fetching shopping cart data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/shoping-cart/add",asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { productId, quantity } = req.body;

            // Kiểm tra nếu `productId` hoặc `quantity` không hợp lệ
            if (!productId || !quantity || isNaN(parseInt(productId)) || isNaN(parseInt(quantity))) {
                res.status(400).send("Invalid product ID or quantity");
                return;
            }

            // Tìm sản phẩm trong cơ sở dữ liệu
            const product = await AppDataSource.getRepository(Product).findOneBy({ id: parseInt(productId) });
            if (!product) {
                res.status(404).send("Product not found");
                return;
            }

            // Lấy giỏ hàng từ session
            const shopingCart = (req.session as any).shopingCart || [];

            // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
            const existingProduct = shopingCart.find((item: any) => item.id === product.id);
            if (existingProduct) {
                existingProduct.quantity += parseInt(quantity); // Cập nhật số lượng
            } else {
                // Thêm sản phẩm mới vào giỏ hàng
                shopingCart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    quantity: parseInt(quantity),
                });
            }

            // Lưu giỏ hàng vào session
            (req.session as any).shopingCart = shopingCart;
            const totalQuantity = shopingCart.reduce((sum: number, item: any) => sum + item.quantity, 0);
            const totalPrice = shopingCart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
            res.json({ success: true, totalQuantity, totalPrice });
            return; 
            // res.redirect("/shoping-cart");
        } catch (error) {
            console.error("Error adding to shoping cart:", error);
            next(error); // Chuyển lỗi đến middleware xử lý lỗi
        }
    })
);
router.post("/shoping-cart/update", asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { productId, quantity } = req.body;

        // Kiểm tra nếu `productId` hoặc `quantity` không hợp lệ
        if (!productId || !quantity || isNaN(parseInt(productId)) || isNaN(parseInt(quantity))) {
             res.status(400).json({ error: "Invalid product ID or quantity" });
             return
        }

        const shopingCart = (req.session as any).shopingCart || [];
        const product = shopingCart.find((item: any) => item.id === parseInt(productId));

        if (product) {
            product.quantity = parseInt(quantity); // Cập nhật số lượng
        } else {
            res.status(404).json({ error: "Product not found in cart" });
            return;
        }

        (req.session as any).shopingCart = shopingCart;

        // Tính tổng số tiền
        const total = shopingCart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

        // Trả về dữ liệu JSON
        res.json({ success: true, total, product });
        return
    } catch (error) {
        console.error("Error updating shopping cart:", error);
        next(error); // Chuyển lỗi đến middleware xử lý lỗi
    }
}));
router.post("/shoping-cart/remove", (req, res) => {
    try {
        const { productId } = req.body;

        const shopingCart = (req.session as any).shopingCart || [];
        const updatedCart = shopingCart.filter((item: any) => item.id !== parseInt(productId));

        (req.session as any).shopingCart = updatedCart;
        const total = updatedCart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

        res.json({ success: true, total });
    } catch (error) {
        console.error("Error removing product from cart:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
//giỏ hàng gì đó

router.get("/shop.grid", async (req, res) => {
    try {
        const category = req.query.category || null; // Lọc theo danh mục
        const size = req.query.size || null; // Lọc theo kích thước
        const sort = req.query.sort || "default"; // Sắp xếp
        const page = parseInt(req.query.page as string) || 1; // Trang hiện tại
        const limit = 12; // Số sản phẩm mỗi trang
        const offset = (page - 1) * limit;
        
        // Truy vấn sản phẩm từ cơ sở dữ liệu
        const query = AppDataSource.getRepository(Product).createQueryBuilder("product")
            .leftJoinAndSelect("product.category", "category");
        // Lọc theo danh mục
        if (category) {
            query.where("category.name = :category", { category });
        }

        // Lọc theo kích thước
        if (size) {
            const sizeRanges: { [key: string]: [number, number] } = {
                "8-10": [8, 10],
                "12-13": [12, 13],
                "18-20": [18, 20],
                "30-32": [30, 32],
            };

            if (size && typeof size === "string" && sizeRanges[size]) {
                const [minHeight, maxHeight] = sizeRanges[size];
                query.andWhere("product.height BETWEEN :minHeight AND :maxHeight", { minHeight, maxHeight });
            }
        }

        // Sắp xếp
        if (sort === "price-asc") {
            query.orderBy("product.price", "ASC");
        } else if (sort === "price-desc") {
            query.orderBy("product.price", "DESC");
        } else {
            query.orderBy("product.id", "ASC");
        }

        // Lấy sản phẩm và tổng số lượng
        const [products, total] = await query.skip(offset).take(limit).getManyAndCount();

        // Tính tổng số trang
        const totalPages = Math.ceil(total / limit);

        // Truy vấn danh mục
        const categories = await AppDataSource.getRepository(Category).find();

        // Render view và truyền dữ liệu
        res.render("frontpage/shop.grid.ejs", {
            products,
            categories,
            selectedCategory: category,
            selectedSize: size,
            selectedSort: sort,
            currentPage: page,
            totalPages,
        });
    } catch (error) {
        console.error("Error fetching shop grid:", error);
        res.status(500).send("Internal Server Error");
    }
});
//trang sản phẩm gì đó

router.get('/checkout', (req: Request, res: Response) => {
    const shopingCart = (req.session as any).shopingCart || [];
    const total = shopingCart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    res.render('frontpage/checkout.ejs', { shopingCart, total });
});
router.post('/checkout', asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { firstName, lastName, country, address, city, zip, phone, email } = req.body;

        // Kiểm tra thông tin bắt buộc
        if (!firstName || !lastName || !country || !address || !city || !zip || !phone || !email) {
            res.status(400).send('All fields are required.');
            return;
        }

        // Lấy giỏ hàng từ session
        const shopingCart = (req.session as any).shopingCart || [];
        if (shopingCart.length === 0) {
            res.status(400).send('Your cart is empty.');
            return;
        }

        // Tính tổng tiền
        const total = shopingCart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

        // Lưu thông tin đơn hàng vào cơ sở dữ liệu
        const order = new Order();
        order.customerName = `${firstName} ${lastName}`;
        order.customerEmail = email;
        order.customerPhone = phone;
        order.customerAddress = `${address}, ${city}, ${country}, ${zip}`;
        order.total = total;
        order.status = "Processing";

        await AppDataSource.getRepository(Order).save(order);

        // Xóa giỏ hàng sau khi đặt hàng thành công
        (req.session as any).shopingCart = [];

        // Trả về thông báo thành công
        res.redirect('/order-success');
    } catch (error) {
        console.error("Error during checkout:", error);
        next(error);
    }
}));
//thanh toán gì đó

router.get("/contact", (req, res) => {
    res.render("frontpage/contact.ejs");
});
//liên hệ gì đó

router.get("/shop-details/:id", asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const productId = parseInt(req.params.id, 10);

        // Kiểm tra nếu `id` không phải là số hợp lệ
        if (isNaN(productId) || productId < 1) {
            console.error("Invalid product ID:", req.params.id);
            res.status(400).send("Invalid product ID");
            return;
        }
        // Tìm sản phẩm trong cơ sở dữ liệu
        const product = await AppDataSource.getRepository(Product)
            .createQueryBuilder("product")
            .leftJoinAndSelect("product.category", "category")
            .where("product.id = :id", { id: productId })
            .getOne();
        // Nếu không tìm thấy sản phẩm
        if (!product) {
            console.error("Product not found for ID:", productId);
            res.status(404).send("Product not found");
            return;
        }

        // Nếu không tìm thấy sản phẩm
        if (!product) {
            console.error("Product not found for ID:", productId);
            res.status(404).send("Product not found");
            return;
        }

        // Render trang chi tiết sản phẩm
        res.render("frontpage/shop-details.ejs", { product });
    } catch (error) {
        console.error("Error fetching product details:", error);
        next(error); // Chuyển lỗi đến middleware xử lý lỗi
    }
}));
//chi tiết sản phẩm gì đó

router.get('/order-success', (req: Request, res: Response) => {
    const order = (req.session as any).order;

    // Kiểm tra nếu không có thông tin đơn hàng
    if (!order) {
        res.redirect('/shoping-cart'); // Chuyển hướng về giỏ hàng nếu không có đơn hàng
        return;
    }

    res.render('frontpage/order-success.ejs', { order });
});

router.post("/api/payment/paypal/create", asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { total } = req.body;

        if (!total || isNaN(total)) {
            res.status(400).json({ error: "Invalid total amount" });
            return;
        }

        const order = await createOrder(total);
        res.json({ id: order.id });
    } catch (error) {
        console.error("Error creating PayPal order:", error);
        next(error); // Pass the error to the next middleware
    }
}));

router.get("/api/payment/paypal/capture", asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token } = req.query;

        if (!token) {
            res.status(400).json({ error: "Missing token" });
            return;
        }

        const capture = await captureOrder(token as string);
        res.render("frontpage/order-success.ejs", { order: capture });
    } catch (error) {
        console.error("Error capturing PayPal order:", error);
        next(error); // Pass the error to the next middleware
    }
}));
//thanh toán trực tuyến gì đó

// Route xử lý yêu cầu chatbot
router.post("/chat", asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const { message } = req.body;

        if (!message) {
            res.status(400).json({ error: "Message is required" });
            return;
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
        });

        const reply = response.choices[0].message?.content;
        res.json({ reply });
    } catch (error) {
        console.error("Error in chatbot:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));

>>>>>>> Stashed changes

export default router;