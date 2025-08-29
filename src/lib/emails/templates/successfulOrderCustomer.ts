export function successfulOrderCustomer(
  orderId: string,
  to: string,
  amounts: {
    subtotal: number;
    tax: number;
    total: number;
  }
) {
  const { subtotal, tax, total } = amounts;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Order Confirmation</title>
    <style>
      body { margin:0; padding:0; background:#f9f9f9; font-family: Arial, sans-serif; }
      .button { background:#ff5a1f; color:#fff; padding:14px 28px; text-decoration:none; border-radius:6px; font-weight:bold; display:inline-block; }
    </style>
  </head>
  <body>
    <table width="100%" bgcolor="#f9f9f9" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table width="600" bgcolor="#ffffff" style="border-radius:10px;">
            <tr>
              <td align="center" style="padding:30px 20px 10px;">
                <img src="https://www.monopolygoservicing.com/MGservicing_Logo.webp" alt="Monopoly GO Servicing" style="max-height:50px;">
                <p style="font-size:22px; font-weight:bold; margin:15px 0;">Thank you! Your order has been placed 🎉</p>
                <p>Order #<b>${orderId}</b></p>
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/order-status?email=${encodeURIComponent(to)}" class="button">Track My Order</a>
              </td>
            </tr>
            <tr>
              <td style="padding:20px;">
                <h3 style="margin:0 0 12px; font-size:18px;">Order Summary</h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="left">Subtotal</td>
                    <td align="right">$${subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td align="left">Tax (5%)</td>
                    <td align="right">$${tax.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td align="left" style="border-top:1px solid #eee; padding-top:10px; font-weight:bold;">Total</td>
                    <td align="right" style="border-top:1px solid #eee; padding-top:10px; font-weight:bold;">$${total.toFixed(2)}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:20px; font-size:12px; color:#888;">
                Need help? <a href="mailto:support@monopolygoservicing.com">Contact us</a><br>
                &copy; 2025 Monopoly GO Servicing. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}
