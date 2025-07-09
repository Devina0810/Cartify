import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, IndianRupee } from "lucide-react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

const AnalyticsTab = () => {
	const [analyticsData, setAnalyticsData] = useState({
		users: 0,
		products: 0,
		totalSales: 0,
		totalRevenue: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [dailySalesData, setDailySalesData] = useState([]);

	useEffect(() => {
		const fetchAnalyticsData = async () => {
			try {
				const response = await axios.get("/analytics");
				setAnalyticsData(response.data.analyticsData);
				setDailySalesData(response.data.dailySalesData);
			} catch (error) {
				console.error("Error fetching analytics data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAnalyticsData();
	}, []);

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className='min-h-screen px-4 py-8 bg-[#fdfaf5] font-[Cormorant Garamond] text-[#5e412f]'>
			<div className='max-w-7xl mx-auto space-y-10'>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
					<AnalyticsCard
						title='Total Users'
						value={analyticsData.users.toLocaleString()}
						icon={Users}
						color='from-[#cabaa5] to-[#a68a7f]'
					/>
					<AnalyticsCard
						title='Total Products'
						value={analyticsData.products.toLocaleString()}
						icon={Package}
						color='from-[#d1bfa3] to-[#a68a7f]'
					/>
					<AnalyticsCard
						title='Total Sales'
						value={analyticsData.totalSales.toLocaleString()}
						icon={ShoppingCart}
						color='from-[#b9a894] to-[#947c6a]'
					/>
					<AnalyticsCard
						title='Total Revenue'
						value={`Rs${analyticsData.totalRevenue.toLocaleString()}`}
						icon={IndianRupee}
						color='from-[#d1c7b2] to-[#a8927e]'
					/>
				</div>

				<motion.div
					className='bg-white rounded-2xl border border-[#cabaa5] shadow-xl p-6'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.25 }}
				>
					<h2 className='text-2xl font-semibold mb-4 text-center'>Sales & Revenue Trends</h2>
					<ResponsiveContainer width='100%' height={400}>
						<LineChart data={dailySalesData}>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis dataKey='name' stroke='#a68a7f' />
							<YAxis yAxisId='left' stroke='#a68a7f' />
							<YAxis yAxisId='right' orientation='right' stroke='#cabaa5' />
							<Tooltip />
							<Legend />
							<Line
								yAxisId='left'
								type='monotone'
								dataKey='sales'
								stroke='#947c6a'
								activeDot={{ r: 6 }}
								name='Sales'
							/>
							<Line
								yAxisId='right'
								type='monotone'
								dataKey='revenue'
								stroke='#a68a7f'
								activeDot={{ r: 6 }}
								name='Revenue'
							/>
						</LineChart>
					</ResponsiveContainer>
				</motion.div>
			</div>
		</div>
	);
};

export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
	<motion.div
		className={`relative bg-gradient-to-br ${color} rounded-2xl p-6 shadow-xl text-white overflow-hidden`}
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<div className='z-10 relative'>
			<p className='text-sm mb-1 font-semibold'>{title}</p>
			<h3 className='text-3xl font-bold'>{value}</h3>
		</div>
		<div className='absolute -bottom-4 -right-4 text-white/40'>
			<Icon className='h-28 w-28' />
		</div>
	</motion.div>
);
