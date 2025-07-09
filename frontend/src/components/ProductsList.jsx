import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const ProductsList = () => {
	const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();

	return (
		<motion.div
			className='bg-[#f8f5f0] rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto font-[Cormorant Garamond]'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<table className='min-w-full divide-y divide-[#d7ccc8]'>
				<thead className='bg-[#eaddcf]'>
					<tr>
						<th className='px-6 py-3 text-left text-xs font-semibold text-[#5e412f] uppercase tracking-wider'>
							Product
						</th>
						<th className='px-6 py-3 text-left text-xs font-semibold text-[#5e412f] uppercase tracking-wider'>
							Price
						</th>
						<th className='px-6 py-3 text-left text-xs font-semibold text-[#5e412f] uppercase tracking-wider'>
							Category
						</th>
						<th className='px-6 py-3 text-left text-xs font-semibold text-[#5e412f] uppercase tracking-wider'>
							Featured
						</th>
						<th className='px-6 py-3 text-left text-xs font-semibold text-[#5e412f] uppercase tracking-wider'>
							Actions
						</th>
					</tr>
				</thead>

				<tbody className='bg-[#fdfaf7] divide-y divide-[#e0d6cd]'>
					{products?.map((product) => (
						<tr key={product._id} className='hover:bg-[#f2eae3] transition-colors duration-300'>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='flex items-center'>
									<div className='h-12 w-12 rounded-full overflow-hidden'>
										<img
											src={product.image}
											alt={product.name}
											className='object-cover w-full h-full'
										/>
									</div>
									<div className='ml-4 text-[#4e342e] font-medium text-lg'>
										{product.name}
									</div>
								</div>
							</td>

							<td className='px-6 py-4 whitespace-nowrap text-[#6d4c41] text-base'>
								Rs{product.price.toFixed(2)}
							</td>

							<td className='px-6 py-4 whitespace-nowrap text-[#6d4c41] text-base'>
								{product.category}
							</td>

							<td className='px-6 py-4 whitespace-nowrap'>
								<button
									onClick={() => toggleFeaturedProduct(product._id)}
									className={`p-2 rounded-full border transition-all duration-200 ${
										product.isFeatured
											? "bg-yellow-200 text-yellow-700 border-yellow-400"
											: "bg-[#e0d6cd] text-[#5e412f] border-[#cabaa5]"
									}`}
								>
									<Star className='h-5 w-5' />
								</button>
							</td>

							<td className='px-6 py-4 whitespace-nowrap'>
								<button
									onClick={() => deleteProduct(product._id)}
									className='text-red-600 hover:text-red-400 transition duration-200'
								>
									<Trash className='h-5 w-5' />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</motion.div>
	);
};

export default ProductsList;
