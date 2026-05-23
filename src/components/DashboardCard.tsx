type DashboardCardProps = {
  title: string;
  value: string;
};

const DashboardCard = ({
  title,
  value,
}: DashboardCardProps) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">
      <h3 className="text-gray-500 text-lg">
        {title}
      </h3>

      <p className="text-4xl font-bold mt-4 text-blue-700">
        {value}
      </p>
    </div>
  );
};

export default DashboardCard;