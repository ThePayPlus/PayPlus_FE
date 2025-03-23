export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 w-full ">
      {/* Remove "container" or "mx-auto" to avoid centering */}
      <div className="flex items-center justify-between">
        {/* Left-aligned section */}
        <div className="text-left">
          <span className="text-2xl font-semibold">PayPlus</span>
          <p className="mt-1 text-sm text-gray-400">&copy; 2024 PayPlus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
