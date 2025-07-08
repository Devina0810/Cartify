import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { razorpay } from "../lib/razorpay.js";
import crypto from "crypto";

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;

		// Calculate total amount in paisa (Razorpay uses paisa, not rupees)
		products.forEach((product) => {
			const amount = Math.round(product.price * 100); // convert to paisa
			totalAmount += amount * product.quantity;
		});

		let coupon = null;
		if (couponCode) {
			coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
			if (coupon) {
				totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
			}
		}

		// Create Razorpay order
		const order = await razorpay.orders.create({
			amount: totalAmount,
			currency: "INR",
			receipt: `order_${Date.now()}`,
			payment_capture: 1,
		});

		// Create new coupon if total amount is >= 20000 paisa (200 rupees)
		if (totalAmount >= 20000) {
			await createNewCoupon(req.user._id);
		}

		res.status(200).json({
			orderId: order.id,
			amount: totalAmount,
			currency: "INR",
			products: products,
			couponCode: couponCode || null,
		});
	} catch (error) {
		console.error("Error creating Razorpay order:", error);
		res.status(500).json({ message: "Error creating order", error: error.message });
	}
};

export const checkoutSuccess = async (req, res) => {
	try {
		const { 
			razorpay_order_id, 
			razorpay_payment_id, 
			razorpay_signature, 
			products, 
			couponCode 
		} = req.body;

		// Verify Razorpay signature
		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
			.update(sign.toString())
			.digest("hex");

		if (razorpay_signature !== expectedSign) {
			return res.status(400).json({ message: "Invalid payment signature" });
		}

		// Get payment details from Razorpay
		const payment = await razorpay.payments.fetch(razorpay_payment_id);

		if (payment.status === "captured") {
			// Deactivate coupon if used
			if (couponCode) {
				await Coupon.findOneAndUpdate(
					{
						code: couponCode,
						userId: req.user._id,
					},
					{
						isActive: false,
					}
				);
			}

			// Create a new Order
			const newOrder = new Order({
				user: req.user._id,
				products: products.map((product) => ({
					product: product.id,
					quantity: product.quantity,
					price: product.price,
				})),
				totalAmount: payment.amount / 100, // convert from paisa to rupees
				razorpayOrderId: razorpay_order_id,
				razorpayPaymentId: razorpay_payment_id,
			});

			await newOrder.save();

			res.status(200).json({
				success: true,
				message: "Payment successful, order created, and coupon deactivated if used.",
				orderId: newOrder._id,
			});
		} else {
			res.status(400).json({ message: "Payment not captured" });
		}
	} catch (error) {
		console.error("Error processing successful checkout:", error);
		res.status(500).json({ message: "Error processing successful checkout", error: error.message });
	}
};

async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		userId: userId,
	});

	await newCoupon.save();

	return newCoupon;
}
