import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";

const GiftCouponCard = () => {
	const [userInputCode, setUserInputCode] = useState("");
	const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } = useCartStore();

	useEffect(() => {
		getMyCoupon();
	}, [getMyCoupon]);

	useEffect(() => {
		if (coupon) setUserInputCode(coupon.code);
	}, [coupon]);

	const handleApplyCoupon = () => {
		if (!userInputCode) return;
		applyCoupon(userInputCode);
	};

	const handleRemoveCoupon = async () => {
		await removeCoupon();
		setUserInputCode("");
	};

	return (
		<motion.div
			className="space-y-6 rounded-xl border border-[#cabaa5] bg-[#fdfaf5] p-6 shadow-md font-[Cormorant Garamond] text-[#5e412f]"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			<div>
				<label htmlFor="voucher" className="block text-lg font-semibold mb-2">
					Do you have a voucher or gift card?
				</label>
				<input
					type="text"
					id="voucher"
					placeholder="Enter code here"
					className="block w-full rounded-md border border-[#cabaa5] bg-[#fcf7ee] text-[#5e412f] placeholder-[#a68a7f] px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#cabaa5]"
					value={userInputCode}
					onChange={(e) => setUserInputCode(e.target.value)}
					required
				/>
			</div>

			<motion.button
				type="button"
				className="w-full rounded-md bg-[#5e412f] hover:bg-[#4a3325] text-white py-2.5 text-base font-medium transition duration-200"
				whileHover={{ scale: 1.04 }}
				whileTap={{ scale: 0.97 }}
				onClick={handleApplyCoupon}
			>
				Apply Code
			</motion.button>

			{isCouponApplied && coupon && (
				<div className="mt-4">
					<h3 className="text-lg font-semibold">Applied Coupon</h3>
					<p className="mt-1 text-base text-[#7d6652]">
						{coupon.code} — {coupon.discountPercentage}% off
					</p>

					<motion.button
						type="button"
						className="mt-3 w-full rounded-md bg-[#a04c4c] hover:bg-[#8e3e3e] text-white py-2.5 text-base font-medium transition duration-200"
						whileHover={{ scale: 1.04 }}
						whileTap={{ scale: 0.97 }}
						onClick={handleRemoveCoupon}
					>
						Remove Coupon
					</motion.button>
				</div>
			)}

			{coupon && !isCouponApplied && (
				<div className="mt-4">
					<h3 className="text-lg font-semibold">Your Available Coupon:</h3>
					<p className="mt-1 text-base text-[#7d6652]">
						{coupon.code} — {coupon.discountPercentage}% off
					</p>
				</div>
			)}
		</motion.div>
	);
};

export default GiftCouponCard;
