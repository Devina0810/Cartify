import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import axios from "../lib/axios";

const OrderSummary = () => {
	const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

	const savings = subtotal - total;
	const formattedSubtotal = subtotal.toFixed(2);
	const formattedTotal = total.toFixed(2);
	const formattedSavings = savings.toFixed(2);

	const handlePayment = async () => {
		try {
			const res = await axios.post("/payments/create-checkout-session", {
				products: cart,
				couponCode: coupon ? coupon.code : null,
			});

			const { orderId, amount, currency } = res.data;

			const script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.onload = () => {
				const options = {
					key: import.meta.env.VITE_RAZORPAY_KEY_ID,
					amount,
					currency,
					name: "Cartify",
					description: "Payment for your order",
					order_id: orderId,
					handler: async function (response) {
						try {
							await axios.post("/payments/checkout-success", {
								razorpay_order_id: response.razorpay_order_id,
								razorpay_payment_id: response.razorpay_payment_id,
								razorpay_signature: response.razorpay_signature,
								products: cart.map((item) => ({
									id: item._id,
									quantity: item.quantity,
									price: item.price,
								})),
								couponCode: coupon ? coupon.code : null,
							});
							window.location.href = "/purchase-success";
						} catch (error) {
							console.error("Payment succeeded but order creation failed:", error);
							alert("Payment succeeded, but order failed. Contact support.");
						}
					},
					prefill: {
						name: "Customer",
						email: "customer@example.com",
					},
					theme: {
						color: "#5e412f",
					},
				};
				new window.Razorpay(options).open();
			};
			document.head.appendChild(script);
		} catch (error) {
			console.error("Payment error:", error);
		}
	};

	return (
		<motion.div
			className="space-y-6 rounded-xl border border-[#cabaa5] bg-[#fdfaf5] p-6 shadow-md font-[Cormorant Garamond] text-[#5e412f]"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<p className="text-2xl font-semibold">Order Summary</p>

			<div className="space-y-4">
				<div className="space-y-2">
					<dl className="flex items-center justify-between text-base">
						<dt className="text-[#7d6652]">Original Price</dt>
						<dd className="font-medium">Rs{formattedSubtotal}</dd>
					</dl>

					{savings > 0 && (
						<dl className="flex items-center justify-between text-base">
							<dt className="text-[#7d6652]">Savings</dt>
							<dd className="text-[#a04c4c] font-medium">-Rs{formattedSavings}</dd>
						</dl>
					)}

					{coupon && isCouponApplied && (
						<dl className="flex items-center justify-between text-base">
							<dt className="text-[#7d6652]">Coupon ({coupon.code})</dt>
							<dd className="text-[#a47551] font-medium">-{coupon.discountPercentage}%</dd>
						</dl>
					)}

					<dl className="flex items-center justify-between border-t border-[#cabaa5] pt-3 text-lg font-bold">
						<dt>Total</dt>
						<dd className="text-[#5e412f]">Rs{formattedTotal}</dd>
					</dl>
				</div>

				<motion.button
					className="w-full rounded-md bg-[#5e412f] hover:bg-[#4a3325] text-white py-2.5 text-base font-medium transition duration-200"
					whileHover={{ scale: 1.03 }}
					whileTap={{ scale: 0.95 }}
					onClick={handlePayment}
				>
					Proceed to Checkout
				</motion.button>

				<div className="flex items-center justify-center gap-2 text-sm text-[#7d6652]">
					<span>or</span>
					<Link
						to="/"
						className="inline-flex items-center gap-2 text-[#5e412f] underline hover:no-underline"
					>
						Continue Shopping <MoveRight size={16} />
					</Link>
				</div>
			</div>
		</motion.div>
	);
};

export default OrderSummary;
