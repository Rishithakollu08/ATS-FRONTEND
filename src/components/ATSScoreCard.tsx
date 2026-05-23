type ATSScoreCardProps = {
  score: number;
};

const ATSScoreCard = ({
  score,
}: ATSScoreCardProps) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        ATS Score
      </h2>

      <div className="text-6xl font-bold text-green-600">
        {score}%
      </div>

      <p className="mt-4 text-gray-500">
        Resume Match Score
      </p>
    </div>
  );
};

export default ATSScoreCard;