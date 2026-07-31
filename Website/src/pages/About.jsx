const technologies = [
  {
    name: "React",
    description: "Provides the interactive frontend and user experience.",
  },
  {
    name: "Tailwind CSS",
    description: "Used to build the responsive visual design.",
  },
  {
    name: "Express",
    description: "Handles API requests between the frontend and ML service.",
  },
  {
    name: "Python & FastAPI",
    description: "Serves the machine learning prediction model.",
  },
];

export default function About() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="max-w-3xl">
        <p className="uppercase tracking-[0.3em] text-[#6B705C] text-sm font-semibold">
          About the project
        </p>

        <h1 className="text-5xl md:text-6xl font-black mt-3">
          Real Estate Price Estimator
        </h1>

        <p className="text-gray-600 text-xl mt-6 leading-relaxed">
          A machine learning powered web application designed to estimate
          residential property prices from basic property characteristics.
        </p>
      </div>

      {/* Description */}
      <div className="grid lg:grid-cols-2 gap-8 mt-16">
        <div className="bg-[#111111] text-white rounded-3xl p-8">
          <p className="text-[#A5A58D] uppercase tracking-widest text-sm font-semibold">
            The idea
          </p>

          <h2 className="text-3xl font-black mt-4">
            Turning property data into useful predictions.
          </h2>

          <p className="text-gray-300 leading-relaxed mt-6">
            Users provide information such as property size, number of bedrooms,
            number of bathrooms, and property age. This information is sent
            through the application's API to a trained machine learning model.
          </p>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-8 shadow-sm">
          <h2 className="text-3xl font-black">How it works</h2>

          <div className="mt-8 space-y-6">
            <div className="flex gap-4">
              <span className="font-black text-[#6B705C]">01</span>
              <p className="text-gray-600">
                The user enters property information.
              </p>
            </div>

            <div className="flex gap-4">
              <span className="font-black text-[#6B705C]">02</span>
              <p className="text-gray-600">
                The React frontend sends the data to the Express API.
              </p>
            </div>

            <div className="flex gap-4">
              <span className="font-black text-[#6B705C]">03</span>
              <p className="text-gray-600">
                The Python prediction service processes the information.
              </p>
            </div>

            <div className="flex gap-4">
              <span className="font-black text-[#6B705C]">04</span>
              <p className="text-gray-600">
                The predicted property value is returned to the user.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technologies */}
      <div className="mt-20">
        <p className="uppercase tracking-[0.3em] text-[#6B705C] text-sm font-semibold">
          Technology
        </p>

        <h2 className="text-4xl font-black mt-3">Built with modern tools</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {technologies.map((technology) => (
            <div
              key={technology.name}
              className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm"
            >
              <div className="w-8 h-1 bg-[#6B705C] rounded-full mb-5" />

              <h3 className="text-xl font-bold">{technology.name}</h3>

              <p className="text-gray-600 mt-3 leading-relaxed">
                {technology.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
