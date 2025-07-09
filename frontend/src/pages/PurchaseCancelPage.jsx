import { XCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PurchaseCancelPage = () => {
	return (
		<div className='min-h-screen flex items-center justify-center px-4 bg-[#fdfaf5] font-[Cormorant Garamond]'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='max-w-md w-full bg-white rounded-lg shadow-2xl overflow-hidden relative z-10 border border-[#cabaa5]'
			>
				<div className='p-6 sm:p-8'>
					<div className='flex justify-center'>
						<XCircle className='text-[#a94444] w-16 h-16 mb-4' />
					</div>
					<h1 className='text-3xl font-bold text-center text-[#5e412f] mb-2'>Purchase Cancelled</h1>
					<p className='text-center text-[#a68a7f] mb-6'>
						Your order was cancelled. No charges have been made to your account.
					</p>

					<div className='bg-[#f7f1e8] rounded-lg p-4 border border-[#e5d9c7] mb-6'>
						<p className='text-sm text-[#7c6654] text-center'>
							If something went wrong during checkout, feel free to contact our support team. We're happy to help.
						</p>
					</div>

					<div className='space-y-4'>
						<Link
							to={"/"}
							className='w-full bg-[#5e412f] hover:bg-[#7a5c45] text-white font-semibold py-2 px-4 rounded-full transition duration-300 flex items-center justify-center'
						>
							<ArrowLeft className='mr-2' size={18} />
							Return to Shop
						</Link>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default PurchaseCancelPage;
