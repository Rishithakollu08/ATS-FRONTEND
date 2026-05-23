import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-6 fixed">
      <h2 className="text-2xl font-bold mb-10">
        ATS Menu
      </h2>

      <div className="flex flex-col gap-5">
        <Link to="/dashboard" className="hover:text-blue-400">
          Dashboard
        </Link>

        <Link to="/upload" className="hover:text-blue-400">
          Upload Resume
        </Link>

        <Link to="/results" className="hover:text-blue-400">
          Results
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;