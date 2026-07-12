import Swal from "sweetalert2";

const brandSwal = Swal.mixin({
  confirmButtonColor: "#f58220",
  cancelButtonColor: "#6b7280",
  customClass: {
    popup: "rounded-2xl!",
    title: "text-xl! font-bold!",
    confirmButton: "rounded-lg! px-6! py-2.5! font-semibold!",
    cancelButton: "rounded-lg! px-6! py-2.5! font-semibold!",
  },
});

export async function showOrderSuccess(orderId: string, total: number) {
  return brandSwal.fire({
    icon: "success",
    title: "অর্ডার নিশ্চিত হয়েছে!",
    html: `
      <p style="color:#6b7280;margin-top:8px">আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে।</p>
      <div style="margin-top:16px;padding:12px;background:#fff8f0;border-radius:12px;text-align:left">
        <p style="font-size:14px;color:#374151"><strong>অর্ডার আইডি:</strong> ${orderId}</p>
        <p style="font-size:14px;color:#374151;margin-top:4px"><strong>মোট:</strong> ৳${total.toLocaleString("bn-BD")}</p>
      </div>
    `,
    confirmButtonText: "ড্যাশবোর্ডে যান",
    allowOutsideClick: false,
  });
}

export async function showUnlockSuccess(message?: string) {
  return brandSwal.fire({
    icon: "success",
    title: "স্বাগতম!",
    text: message ?? "আপনার ড্যাশবোর্ড এখন unlocked।",
    confirmButtonText: "ঠিক আছে",
    timer: 2500,
    timerProgressBar: true,
  });
}

export async function showUnlockError(message: string) {
  return brandSwal.fire({
    icon: "error",
    title: "লগইন ব্যর্থ",
    text: message,
    confirmButtonText: "আবার চেষ্টা করুন",
  });
}

export async function showValidationError(message: string) {
  return brandSwal.fire({
    icon: "warning",
    title: "তথ্য অসম্পূর্ণ",
    text: message,
    confirmButtonText: "ঠিক আছে",
  });
}
