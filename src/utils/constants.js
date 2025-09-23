export const OrderStatuses = [
    { key: "notAccepted", label: "Not Accepted", color: "#4f4f4f" },
    { key: "accepted", label: "Accepted", color: "#52c41a" },
    { key: "pickup", label: "Pickup", color: "#52c41a" },
    { key: "rejected", label: "Rejected", color: "#ff4d4f" },
    { key: "confirmDetails", label: "Confirm Details", color: "#faad14" },
    { key: "drop", label: "Drop", color: "#1890ff" },
    { key: "dropped", label: "Dropped", color: "#722ed1" },
    { key: "proof", label: "Proof", color: "#13c2c2" },
  ];


export const BulkOrderStatuses = [
    { key: "notAccepted", label: "Not Accepted", color: "#4f4f4f" },
    { key: "accepted", label: "Accepted", color: "#52c41a" },
    { key: "rejected", label: "Rejected", color: "#ff4d4f" },
    { key: "dropped", label: "Delivered", color: "#722ed1" },
  ];

  export const statusColorMap = {
    PLACED: "text-blue-600 bg-blue-50",
    OUT_FOR_DELIVERY: "text-orange-600 bg-orange-50",
    DELIVERED: "text-green-600 bg-green-50",
    CANCELLED: "text-red-600 bg-red-50",
    REFUNDED: "text-red-600 bg-red-50",
    REFUNDED_REQUESTED: "text-orange-600 bg-orange-50",
  };
  