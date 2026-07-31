export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-black">
              Real Estate
              <span className="text-[#A5A58D]"> AI</span>
            </h2>

            <p className="text-gray-400 mt-3 max-w-md">
              An AI-powered real estate price estimation system combining modern
              web development with machine learning.
            </p>
          </div>

          <div className="md:text-right">
            <p className="text-[#A5A58D] font-semibold">
              React • Express • FastAPI • Machine Learning
            </p>

            <p className="text-gray-500 text-sm mt-3">Academic Project</p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Real Estate Price Estimator. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
