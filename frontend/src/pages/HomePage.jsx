import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
	{ href: "/suits", name: "Suits", imageUrl: "https://d1fufvy4xao6k9.cloudfront.net/images/blog/posts/2019/11/ig_fw19_suit_6.jpg" },
	{ href: "/t-shirts", name: "Tees", imageUrl: "/tshirts.jpg" },
	{ href: "/jeans", name: "Jeans", imageUrl: "https://www.buffalojeans.com/cdn/shop/products/BL15670-469-02_600x.jpg?v=1678289795" },
	{ href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpeg" },
	{ href: "/glasses", name: "Glasses", imageUrl: "/glasses.jpg" },
	{ href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
	{ href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
];

const HomePage = () => {
	const { fetchFeaturedProducts, products, isLoading } = useProductStore();

	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);

	return (
		<div className='relative min-h-screen bg-[#f5f0e8] text-[#5e412f] font-[Cormorant Garamond] overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-center text-5xl sm:text-6xl font-semibold text-[#5e412f] mb-4'>
					Explore Our Categories
				</h1>
				<p className='text-center text-xl text-[#7b6650] mb-12'>
					Discover the latest trends in timeless fashion
				</p>

				<div className='grid grid-cols-1 gap-6 max-w-xl mx-auto'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>

				{!isLoading && products.length > 0 && (
					<div className="mt-16">
						<FeaturedProducts featuredProducts={products} />
					</div>
				)}
			</div>
		</div>
	);
};

export default HomePage;
