import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="w-full h-20 bg-white shadow-md flex items-center justify-between px-12">
        <h1 className="text-3xl font-bold text-blue-800">
          Resume ATS
        </h1>

        <div className="flex gap-5">
          <Link
            to="/login"
            className="px-8 py-3 bg-blue-700 text-white text-lg font-semibold rounded-md hover:bg-blue-800 transition duration-300 shadow-lg"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-8 py-3 bg-green-700 text-white text-lg font-semibold rounded-md hover:bg-green-800 transition duration-300 shadow-lg"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-12 lg:px-24 py-20">
        {/* Left Content */}
        <div className="max-w-3xl">
          <h1 className="text-6xl font-bold text-gray-800 leading-tight mb-8">
            Smart Resume
            <span className="text-blue-700">
              {" "}
              ATS Platform
            </span>
          </h1>

          <p className="text-2xl text-gray-600 leading-10 mb-10">
            Analyze resumes instantly,
            calculate ATS scores,
            identify missing skills,
            rank candidates,
            and streamline recruitment
            with an intelligent hiring platform.
          </p>

          <div className="flex gap-6">
            <Link
              to="/register"
              className="px-10 py-5 bg-blue-700 text-white text-xl font-bold rounded-md hover:bg-blue-800 transition duration-300 shadow-xl"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="px-10 py-5 bg-white border-2 border-blue-700 text-blue-700 text-xl font-bold rounded-md hover:bg-blue-50 transition duration-300 shadow-xl"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Right Side Card */}
        <div className="mt-16 lg:mt-0">
          <div className="bg-white w-[500px] p-10 rounded-2xl shadow-2xl border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              ATS Features
            </h2>

            <div className="space-y-6">
              <div className="p-5 bg-blue-50 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-700 mb-2">
                  Resume Analysis
                </h3>

                <p className="text-gray-600">
                  Upload resumes and extract
                  candidate information instantly.
                </p>
              </div>

              <div className="p-5 bg-green-50 rounded-xl">
                <h3 className="text-xl font-semibold text-green-700 mb-2">
                  ATS Scoring
                </h3>

                <p className="text-gray-600">
                  Calculate resume match scores
                  based on job requirements.
                </p>
              </div>

              <div className="p-5 bg-purple-50 rounded-xl">
                <h3 className="text-xl font-semibold text-purple-700 mb-2">
                  Missing Skills
                </h3>

                <p className="text-gray-600">
                  Identify missing technical
                  and professional skills.
                </p>
              </div>

              <div className="p-5 bg-orange-50 rounded-xl">
                <h3 className="text-xl font-semibold text-orange-700 mb-2">
                  Candidate Ranking
                </h3>

                <p className="text-gray-600">
                  Rank candidates automatically
                  using ATS scores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center mt-10">
        <p className="text-lg">
          © 2026 Resume ATS Platform.
          All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;