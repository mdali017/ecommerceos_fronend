import Swal from "sweetalert2";

const brandSwal = Swal.mixin({
  confirmButtonColor: "#f58220",
  cancelButtonColor: "#6b7280",
  customClass: {
    popup: "rounded-2xl!",
    title: "text-xl! font-bold!",
    confirmButton: "rounded-lg! px-6! py-2.5! font-semibold!",
  },
});

export async function showAdminLoginSuccess(name: string) {
  return brandSwal.fire({
    icon: "success",
    title: "Login Successful!",
    text: `Welcome, ${name}! Your admin dashboard is now unlocked.`,
    confirmButtonText: "Continue",
    timer: 2500,
    timerProgressBar: true,
  });
}

export async function showAdminLoginError(message: string) {
  return brandSwal.fire({
    icon: "error",
    title: "Login Failed",
    text: message,
    confirmButtonText: "Try Again",
  });
}

export async function showAdminValidationError(message: string) {
  return brandSwal.fire({
    icon: "warning",
    title: "Missing Information",
    text: message,
    confirmButtonText: "OK",
  });
}

export async function showPosOrderSuccess(orderId: string, total: number) {
  return brandSwal.fire({
    icon: "success",
    title: "Order Placed!",
    html: `
      <p style="color:#6b7280;margin-top:8px">Order created with <strong>Pending</strong> status.</p>
      <div style="margin-top:16px;padding:12px;background:#fff8f0;border-radius:12px;text-align:left">
        <p style="font-size:14px;color:#374151"><strong>Order ID:</strong> ${orderId}</p>
        <p style="font-size:14px;color:#374151;margin-top:4px"><strong>Total:</strong> ৳${total.toLocaleString("en-US")}</p>
      </div>
      <p style="color:#6b7280;margin-top:12px;font-size:13px">Mark as Completed from Admin Orders after delivery.</p>
    `,
    confirmButtonText: "Continue",
  });
}
