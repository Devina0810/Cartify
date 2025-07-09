const LoadingSpinner = () => {
	return (
		<div className="flex items-center justify-center min-h-screen bg-[#fdfaf5] font-[Cormorant Garamond]">
			<div className="relative">
				<div className="w-20 h-20 border-[#d8cfc4] border-[3px] rounded-full" />
				<div className="w-20 h-20 border-[#5e412f] border-t-[3px] animate-spin rounded-full absolute left-0 top-0" />
				<div className="sr-only">Loading</div>
			</div>
		</div>
	);
};

export default LoadingSpinner;
