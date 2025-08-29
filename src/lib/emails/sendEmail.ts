import { transporter } from "./transporter";
import { successfulOrderCustomer } from "./templates/successfulOrderCustomer";
import { successfulOrderAdmin } from "./templates/successfulOrderAdmin";

export async function sendCustomerEmail(
  to: string,
  orderId: string,
  amounts: { originalSubtotal: number; discount: number; subtotal: number; tax: number; total: number }
) {
  try {
    const html = successfulOrderCustomer(orderId, to, amounts);

    const info = await transporter.sendMail({
      from: `"Monopoly GO Servicing" <${process.env.EMAIL_USER}>`,
      to,
      subject: "🎲 Your Order Confirmation",
      html,
    });

    console.log("✅ Customer email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Failed to send customer email:", err);
  }
}

export async function sendAdminEmail(orderId: string, customerEmail: string) {
  try {
    const html = successfulOrderAdmin(orderId, customerEmail);

    const info = await transporter.sendMail({
      from: `"Monopoly GO Servicing" <${process.env.EMAIL_USER}>`,
      to: "gostickerhub1@gmail.com", // your private email
      subject: `🛒 New Order Paid — ${orderId}`,
      html,
    });

    console.log("✅ Admin email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Failed to send admin email:", err);
  }
}
