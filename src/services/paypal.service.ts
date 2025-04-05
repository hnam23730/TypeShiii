import paypal from "@paypal/checkout-server-sdk";

const environment =
    process.env.PAYPAL_MODE === "live"
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
    });
    const response = await client.execute(request);
    console.log("PayPal Response:", response);
    return response.result;
};

export const captureOrder = async (orderId: string) => {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    //request.requestBody({}); // Không cần thêm thuộc tính `payment_source`
    const response = await client.execute(request);
    console.log("Capture Response:", response);
    return response.result;
};