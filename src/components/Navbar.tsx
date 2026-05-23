const Navbar = () => {
  return (
    <div className="bg-blue-700 text-white px-8 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold">
        Resume ATS System
      </h1>

      <button
        className="bg-red-500 px-4 py-2 rounded-lg"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;