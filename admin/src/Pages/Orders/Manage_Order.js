import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, Package, Tag, RefreshCw, AlertTriangle } from "lucide-react";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  returned: "bg-gray-100 text-gray-800",
  progress: "bg-indigo-100 text-indigo-800",
};

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (page) => {
    try {
      setLoading(true);
      const response = await fetch(`https://www.api.creativencolourful.com/api/v1/admin/get-all-order?page=${page}&limit=6`);
      const responseData = await response.json();
      const { data, totalPages } = responseData;
      setOrders(data);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch orders. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleStatusChange = async (orderId, status) => {
    try {
      console.log("orderId, status", orderId, status);
      setLoading(true);
      const response = await fetch("https://www.api.creativencolourful.com/api/v1/admin/change-order-status", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status }),
      });
      const data = await response.json();
      console.log(data);
      fetchOrders(currentPage);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        setLoading(true);
        await fetch(`https://www.api.creativencolourful.com/api/v1/admin/delete-order/${orderId}`, {
          method: 'DELETE',
        });
        fetchOrders(currentPage);
        alert("Order deleted successfully");
      } catch (err) {
        console.log(err);
        setError("Failed to delete order. Please try again later.");
        setLoading(false);
      }
    }
  };

  const handlePrintOrder = (order) => {
    const printWindow = window.open("", "_blank", "width=900,height=650");

    printWindow.document.open();
    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>Invoice - ${order.orderId}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      margin: 0;
      background: #f4f6f8;
      color: #111;
    }

    .invoice {
      max-width: 820px;
      margin: 20px auto;
      background: #fff;
      padding: 28px;
      border-radius: 10px;
    }

    .top {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 16px;
    }

    .brand h1 {
      margin: 0;
      color: #2563eb;
      font-size: 26px;
    }

    .invoice-meta {
      text-align: right;
      font-size: 14px;
    }

    .section {
      margin-top: 22px;
    }

    .section h3 {
      font-size: 15px;
      margin-bottom: 8px;
      color: #2563eb;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      font-size: 14px;
    }

    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }

    .success { background: #dcfce7; color: #166534; }
    .danger { background: #fee2e2; color: #991b1b; }
    .offer { background: #e0f2fe; color: #075985; }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 14px;
    }

    th, td {
      border: 1px solid #e5e7eb;
      padding: 10px;
      text-align: left;
    }

    th {
      background: #f9fafb;
      font-weight: 600;
    }

    .summary {
      width: 300px;
      margin-left: auto;
      margin-top: 20px;
      font-size: 14px;
    }

    .summary div {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
    }

    .summary .final {
      font-size: 18px;
      font-weight: 700;
      border-top: 2px solid #e5e7eb;
      padding-top: 8px;
    }

    .footer {
      margin-top: 30px;
      border-top: 1px dashed #e5e7eb;
      padding-top: 12px;
      font-size: 12px;
      color: #555;
    }

    @media print {
      body { background: #fff; }
      .invoice { box-shadow: none; margin: 0; }
    }
      .orderStatus{
        text-transform: capitalize;
      }
  </style>
</head>

<body>
  <div class="invoice">

    <!-- HEADER -->
    <div class="top">
      <div class="brand">
        <h1>Invoice</h1>
        <p>E-Commerce Invoice</p>
      </div>
      <div class="invoice-meta">
        <div><strong>Order ID:</strong> ${order.orderId}</div>
        <div><strong>Date:</strong> ${new Date(order.orderDate).toLocaleString()}</div>
        <div>
          <span class="badge success orderStatus">${order.status}</span>
        </div>
      </div>
    </div>

    <!-- CUSTOMER & SHIPPING -->
    <div class="section">
      <h3>Customer & Shipping Details</h3>
      <div class="grid">
        <div><strong>Name:</strong> ${order.shipping?.name || order.userId?.Name}</div>
        <div><strong>Mobile:</strong> ${order.shipping.mobileNumber}</div>
        <div><strong>Email:</strong> ${order.userId?.Email}</div>
        <div><strong>Address Type:</strong> ${order.shipping.addressType}</div>
        <div style="grid-column: span 2;">
        <strong>Address:</strong>
        ${order.shipping.addressLine}, ${order.shipping.city},
        ${order.shipping.state} - ${order.shipping.postCode}
        </div>
        <div><strong>Order Type:</strong> ${order.paymentType}</div>
      </div>
    </div>

    <!-- OFFER -->
    ${order.offerId ? `
    <div class="section">
      <h3>Offer Applied</h3>
      <span class="badge offer">${order.offerId.code} (${order.offerId.discount}% OFF)</span>
    </div>
    ` : ""}

    <!-- REFUND -->
    ${order.refundRequest ? `
    <div class="section">
      <h3>Refund Request</h3>
      <span class="badge danger">Requested</span>
      <p><strong>Reason:</strong> ${order.refundReason || "N/A"}</p>
    </div>
    ` : ""}

    <!-- ITEMS -->
    <div class="section">
      <h3>Order Items</h3>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Size</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.size}</td>
              <td>${item.quantity}</td>
              <td>₹${item.price.toFixed(2)}</td>
              <td>₹${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <!-- SUMMARY -->
    <div class="summary">
      <div>
        <span>Subtotal</span>
        <span>₹${order.totalAmount.toFixed(2)}</span>
      </div>
      <div>
        <span>Delivery Fee</span>
        <span>₹${order.shippingAmount.toFixed(2)}</span>
      </div>

      ${order.paymentType === "COD" ? `
      <div>
        <span>COD Fee</span>
        <span>-₹${order.codFeeAmount.toFixed(2)}</span>
      </div>
      ` : ""}

      ${order.offerId ? `
      <div>
        <span>Discount</span>
        <span>-₹${(order.totalAmount - order.payAmt).toFixed(2)}</span>
      </div>
      ` : ""}

      <div class="final">
        <span>Total Paid</span>
        <span>₹${order.payAmt - (order.paymentType === "COD" ? order.codFeeAmount : 0)}</span>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <p>Thank you for shopping with us ❤️</p>
      <p>This is a system generated invoice.</p>
    </div>

  </div>

  <script>
    window.onload = function () {
      setTimeout(() => {
        window.print();
        window.onafterprint = () => window.close();
      }, 500);
    };
  </script>
</body>
</html>
  `);

    printWindow.document.close();
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-red-500">
          <AlertCircle className="w-8 h-8" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center gap-3 mb-8">
          <Package className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
        </header>

        <div className="overflow-x-auto bg-white shadow-sm rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Order ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Offer</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Refund</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Payment</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900 font-medium">{order.orderId}</td>
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    <div className="flex flex-col">
                      {order.offerId && Object.keys(order.offerId).length > 0 ? (
                        <>
                          <span className="text-gray-500 line-through text-xs">₹{order.totalAmount.toFixed(2)}</span>
                          <span className="text-green-600 font-medium">₹{order.payAmt.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="font-medium">₹{order.payAmt.toFixed(2)}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {order.offerId && Object.keys(order.offerId).length > 0 ? (
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-500" />
                        <div className="flex flex-col">
                          <span className="text-green-600 font-medium text-xs">{order.offerId.code}</span>
                          <span className="text-gray-500 text-xs">{order.offerId.discount}% off</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">No offer</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {order.refundRequest ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <RefreshCw className="w-4 h-4 text-red-500" />
                          <span className="text-red-600 font-medium text-xs">Requested</span>
                        </div>
                        {order.refundReason && (
                          <div className="group relative">
                            <AlertTriangle className="w-4 h-4 text-amber-500 cursor-help" />
                            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                              <div className="font-medium mb-1">Refund Reason:</div>
                              <div>{order.refundReason}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">No refund</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">{order.paymentType}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {
                      new Date(order.orderDate).toLocaleDateString()
                    }
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePrintOrder(order)}
                          className="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                          Print
                        </button>
                        <button
                          onClick={() => window.location.href = `/order/${order?.orderId}`}
                          className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded hover:bg-green-600"
                        >
                          View
                        </button>
                      </div>
                      <select
                        className="px-2 py-1 text-xs bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          if (selectedValue === "delete") {
                            handleDeleteOrder(order._id);
                          }
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select Action
                        </option>
                        <option value="delete" className="text-red-600">
                          Delete Order
                        </option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageOrder;