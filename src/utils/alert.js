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

export const showAddedToBasketAlert = (machineName, isDuplicate, quantity, onGoToBasket) => {
  return Swal.fire({
    icon: "success",
    title: isDuplicate ? "Basket Updated!" : "Added to Basket!",
    html: `
      <div style="font-size: 14px; color: #444; line-height: 1.6; text-align: center;">
        <p style="margin: 0 0 10px;">
          <strong>${machineName}</strong> ${
            isDuplicate
              ? `quantity has been updated to <strong>${quantity}</strong>.`
              : `has been added with default configuration.`
          }
        </p>
        <p style="margin: 0; font-size: 13px; color: #6b7c72;">
          You can configure options, modify specifications, or submit your request from your basket.
        </p>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "View Basket",
    cancelButtonText: "Continue Browsing",
    confirmButtonColor: "#173f35",
    cancelButtonColor: "#6b7c72",
    background: "#ffffff",
  }).then((res) => {
    if (res.isConfirmed && typeof onGoToBasket === "function") {
      onGoToBasket();
    }
  });
};

export { Swal };
export default Swal;
