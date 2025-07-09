import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const FeaturedProducts = ({ featuredProducts }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(4);

	const { addToCart } = useCartStore();

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) setItemsPerPage(1);
			else if (window.innerWidth < 1024) setItemsPerPage(2);
			else if (window.innerWidth < 1280) setItemsPerPage(3);
			else setItemsPerPage(4);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const nextSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
	};

	const prevSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
	};

	const isStartDisabled = currentIndex === 0;
	const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

	return (
		<div className='py-16 bg-[#f5f0e8] font-[Cormorant Garamond]'>
			<div className='container mx-auto px-4'>
				<h2 className='text-center text-5xl sm:text-6xl font-semibold text-[#5e412f] mb-12'>
					Featured
				</h2>
				<div className='relative'>
					<div className='overflow-hidden'>
						<div
							className='flex transition-transform duration-300 ease-in-out'
							style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
						>
							{featuredProducts?.map((product) => (
								<div key={product._id} className='w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-3'>
									<div className='bg-white rounded-xl shadow-md overflow-hidden h-full border border-[#decab1] transition-all duration-300 hover:shadow-lg'>
										<div className='overflow-hidden'>
											<img
												src={product.image}
												alt={product.name}
												className='w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-105'
											/>
										</div>
										<div className='p-5'>
											<h3 className='text-2xl text-[#5e412f] font-semibold mb-2'>
												{product.name}
											</h3>
											<p className='text-[#9c7e5c] text-lg font-medium mb-4'>
												₹{product.price.toFixed(2)}
											</p>
											<button
												onClick={() => addToCart(product)}
												className='w-full bg-[#5e412f] hover:bg-[#7b5d42] text-[#f5f0e8] font-medium py-2 px-4 rounded-md transition duration-300 flex items-center justify-center'
											>
												<ShoppingCart className='w-5 h-5 mr-2' />
												Add to Cart
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Navigation buttons */}
					<button
						onClick={prevSlide}
						disabled={isStartDisabled}
						className={`absolute top-1/2 -left-5 transform -translate-y-1/2 p-2 rounded-full border transition-colors duration-300 ${
							isStartDisabled
								? "bg-gray-300 cursor-not-allowed"
								: "bg-[#5e412f] hover:bg-[#7b5d42] text-white"
						}`}
					>
						<ChevronLeft className='w-6 h-6' />
					</button>

					<button
						onClick={nextSlide}
						disabled={isEndDisabled}
						className={`absolute top-1/2 -right-5 transform -translate-y-1/2 p-2 rounded-full border transition-colors duration-300 ${
							isEndDisabled
								? "bg-gray-300 cursor-not-allowed"
								: "bg-[#5e412f] hover:bg-[#7b5d42] text-white"
						}`}
					>
						<ChevronRight className='w-6 h-6' />
					</button>
				</div>
			</div>
		</div>
	);
};

export default FeaturedProducts;
