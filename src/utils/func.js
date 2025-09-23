 export function toOrderStatus(statusKey) {
    switch (statusKey) {
      case "notAccepted":
      case "pickup":
      case "confirmDetails":
        return "PLACED";
      case "drop":
      case "dropped":
        return "OUT_FOR_DELIVERY";
      case "proof":
        return "DELIVERED";
      case "cancelled":
        return "CANCELLED";
      case "processing":
        return "REFUNDED_REQUESTED";
      case "refund":
        return "REFUNDED";
      default:
        return null;
    }
  }

  export function formatStatusLabel(status) {
  if (!status) return "Unknown";
  return status
    .toLowerCase()
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}