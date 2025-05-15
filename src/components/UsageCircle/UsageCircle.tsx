interface UsageCircleProps {
  label: string;
  usedPercent: number;
  type?: string;
}

const UsageCircle = ({ type, label, usedPercent }: UsageCircleProps) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = (1 - usedPercent / 100) * circumference;
  const strokeColor = type === "ram" ? "#32C837" : "#0065AD";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-30 h-30">
        <svg className="w-full h-full transform rotate-92" viewBox="0 0 96 96">
          <circle
            cx={48}
            cy={48}
            r={radius}
            className="stroke-gray-300"
            strokeWidth={10}
            fill="transparent"
          />
          <circle
            cx={48}
            cy={48}
            r={radius}
            stroke={strokeColor}
            className="transition-all duration-500 ease-in-out"
            strokeWidth={10}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-normal opacity-60">
            {usedPercent}%
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-700">{label}</p>
    </div>
  );
};

export default UsageCircle;
