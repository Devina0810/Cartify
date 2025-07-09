import { Link } from "react-router-dom";

const CategoryItem = ({ category }) => {
	return (
		<div className='relative overflow-hidden h-96 w-full rounded-xl group shadow-md'>
			<Link to={"/category" + category.href}>
				<div className='w-full h-full cursor-pointer'>
					{/* Removed heavy brown overlay */}
					<img
						src={category.imageUrl}
						alt={category.name}
						className='w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105'
						loading='lazy'
					/>

					{/* Keep readable text with subtle background */}
					<div className='absolute bottom-0 left-0 right-0 bg-black/40 p-5 z-20'>
						<h3 className='text-3xl font-semibold text-[#f5f0e8] font-[Cormorant Garamond] mb-1 tracking-wide'>
							{category.name}
						</h3>
						<p className='text-[#e0d4c1] text-sm font-[Cormorant Garamond]'>
							Explore {category.name}
						</p>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default CategoryItem;
