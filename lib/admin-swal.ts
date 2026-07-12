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
