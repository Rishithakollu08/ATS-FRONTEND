import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ATSScoreCard from "../components/ATSScoreCard";
import MissingSkills from "../components/MissingSkills";

const Results = () => {
  const missingSkills = [
    "React",
    "Spring Boot",
    "Docker",
  ];

  return (
    <div>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="ml-64 p-10 w-full">
          <h1 className="text-4xl font-bold mb-10">
            ATS Results
          </h1>

          <ATSScoreCard score={85} />

          <MissingSkills
            skills={missingSkills}
          />
        </div>
      </div>
    </div>
  );
};

export default Results;