import paypal from "@paypal/checkout-server-sdk";

const environment =
    process.env.PAYPAL_MODE === "sanbox"
        ? new paypal.core.LiveEnvironment(
              process.env.PAYPAL_CLIENT_ID!,
              process.env.PAYPAL_CLIENT_SECRET!
          )
        : new paypal.core.SandboxEnvironment(
              process.env.PAYPAL_CLIENT_ID!,
              process.env.PAYPAL_CLIENT_SECRET!
          );
          console.log("PAYPAL_CLIENT_ID:", process.env.PAYPAL_CLIENT_ID);
          console.log("PAYPAL_CLIENT_SECRET:", process.env.PAYPAL_CLIENT_SECRET);
          console.log("PAYPAL_MODE:", process.env.PAYPAL_MODE);
const client = new paypal.core.PayPalHttpClient(environment);

export const createOrder = async (total: number) => {
    try {
        // Nếu total không hợp lệ, đặt giá trị mặc định
        if (isNaN(total) || total <= 0) {
            console.warn("Total is invalid. Setting default value.");
            total = 1.00; // Giá trị mặc định
        }

        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: total.toFixed(2),
                    },
                },
            ],
            application_context: {
                return_url: "http://localhost:3000/api/payment/paypal/capture", // URL callback sau khi thanh toán thành công
                cancel_url: "http://localhost:3000/checkout", // URL callback nếu người dùng hủy thanh toán
            },
        });

        const response = await client.execute(request);
        console.log("PayPal Order Created:", response.result);
        return response.result;
    } catch (error: any) {
        console.error("Error creating PayPal order:", error.response?.data || error.message);
        throw new Error("Failed to create PayPal order");
    }
};
export const captureOrder = async (orderId: string) => {
    try {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        const response = await client.execute(request);

        if (!response.result || !response.result.purchase_units) {
            throw new Error("Invalid response from PayPal");
        }

        console.log("Capture Response:", response.result);
        return response.result;
    } catch (error: any) {
        console.error("Error capturing PayPal order:", error.response?.data || error.message);
        throw new Error("Failed to capture PayPal order");
    }
};