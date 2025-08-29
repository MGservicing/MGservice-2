export function successfulOrderAdmin(orderId: string, customerEmail: string) {
  return `
    <h2>New order received ✅</h2>
    <p><b>Order ID:</b> ${orderId}</p>
    <p><b>Customer:</b> ${customerEmail}</p>
  `;
}
