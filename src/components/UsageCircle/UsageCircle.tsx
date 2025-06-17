interface UsageCircleProps {
  label: string;
  usedPercent: number;
  type?: string;
}

const UsageCircle = ({ type, label, usedPercent }: UsageCircleProps) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = (1 - usedPercent / 100) * circumference;

  const gradientId = `gradient-${type ?? "default"}`;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[120px] h-[120px] xl:w-[90px] xl:h-[90px]">
        <svg className="w-full h-full transform rotate-92" viewBox="0 0 96 96">
          <defs>
            <linearGradient id={gradientId} x1="1" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={type === "ram" ? "#32C837" : "#0065AD"}
              />
              <stop
                offset="100%"
                stopColor={type === "ram" ? "#90EE90" : "#4CA3DD"}
              />
            </linearGradient>
          </defs>

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
            stroke={`url(#${gradientId})`}
            className="transition-all duration-500 ease-in-out"
            strokeWidth={10}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl lg:text-lg font-normal opacity-60">
            {usedPercent}%
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm xl:text-xs text-gray-700">{label}</p>
    </div>
  );
};

export default UsageCircle;
