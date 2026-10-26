import Swal from "sweetalert2";

export const showSuccessAlert = (title, text = "") => {
  return Swal.fire({
    icon: "success",
    title: title || "Success",
    text,
    confirmButtonColor: "#c94f2d",
    background: "#ffffff",
  });
};

export const showErrorAlert = (title, text = "") => {
  return Swal.fire({
    icon: "error",
    title: title || "Error",
    text,
    confirmButtonColor: "#c94f2d",
    background: "#ffffff",
  });
};

export const showConfirmAlert = async (title, text = "", confirmButtonText = "Confirm") => {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#c94f2d",
    cancelButtonColor: "#6b7c72",
    confirmButtonText,
  });
};

export const showPromptAlert = async (title, inputPlaceholder = "") => {
  return Swal.fire({
    title,
    input: "text",
    inputPlaceholder,
    showCancelButton: true,
    confirmButtonColor: "#c94f2d",
    cancelButtonColor: "#6b7c72",
  });
};

export { Swal };
export default Swal;
