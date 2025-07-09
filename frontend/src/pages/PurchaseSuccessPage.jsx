import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import Confetti from "react-confetti";

const PurchaseSuccessPage = () => {
	const [isProcessing, setIsProcessing] = useState(true);
	const { clearCart } = useCartStore();
	const [error, setError] = useState(null);

	useEffect(() => {
		clearCart();
		setIsProcessing(false);
	}, [clearCart]);

	if (isProcessing) return "Processing...";
	if (error) return `Error: ${error}`;

	return (
		<div className='h-screen flex items-center justify-center px-4 bg-[#fdfaf5] font-[Cormorant Garamond] text-[#5e412f]'>
			<Confetti
				width={window.innerWidth}
				height={window.innerHeight}
				gravity={0.08}
				style={{ zIndex: 99 }}
				numberOfPieces={600}
				recycle={false}
			/>

			<div className='max-w-md w-full bg-white border border-[#cabaa5] rounded-3xl shadow-2xl relative z-10'>
				<div className='p-6 sm:p-8'>
					<div className='flex justify-center'>
						<CheckCircle className='text-[#7a5c45] w-16 h-16 mb-4' />
					</div>
					<h1 className='text-3xl font-bold text-center mb-2'>Purchase Successful!</h1>
					<p className='text-center text-[#a68a7f] mb-2'>
						Thank you for your order. We’re processing it now.
					</p>
					<p className='text-sm text-center text-[#cabaa5] mb-6'>
						Check your email for order details and updates.
					</p>

					<div className='bg-[#f7f2ec] rounded-xl p-4 border border-[#e5d9c7] mb-6'>
						<div className='flex items-center justify-between mb-2'>
							<span className='text-sm text-[#a68a7f]'>Order number</span>
							<span className='text-sm font-medium text-[#5e412f]'>#12345</span>
						</div>
						<div className='flex items-center justify-between'>
							<span className='text-sm text-[#a68a7f]'>Estimated delivery</span>
							<span className='text-sm font-medium text-[#5e412f]'>3–5 business days</span>
						</div>
					</div>

					<div className='space-y-4'>
						<button
							className='w-full bg-[#5e412f] hover:bg-[#7a5c45] text-white font-medium py-2 px-4 rounded-full 
              flex items-center justify-center transition duration-300'
						>
							<HandHeart className='mr-2' size={18} />
							Thanks for trusting us!
						</button>

						<Link
							to={"/"}
							className='w-full border border-[#cabaa5] text-[#5e412f] hover:bg-[#f2ebe4] 
              font-medium py-2 px-4 rounded-full transition duration-300 flex items-center justify-center'
						>
							Continue Shopping
							<ArrowRight className='ml-2' size={18} />
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PurchaseSuccessPage;
