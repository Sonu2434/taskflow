const ProgressBar = ({ value = 0, showLabel = true, size = 'md', color = 'blue' }) => {
  const heights = { sm: 'h-1', md: 'h-2', lg: 'h-3' };
  const colors = {
    blue: 'linear-gradient(90deg, #4f8ef7, #8b5cf6)',
    green: 'linear-gradient(90deg, #10b981, #06b6d4)',
    orange: 'linear-gradient(90deg, #f59e0b, #ef4444)',
  };

  const pct = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>Progress</span>
          <span className="text-white font-medium">{pct}%</span>
        </div>
      )}
      <div className={`w-full ${heights[size]} rounded-full overflow-hidden`}
        style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className={`h-full rounded-full transition-all duration-500`}
          style={{ width: `${pct}%`, background: colors[color] }} />
      </div>
    </div>
  );
};

export default ProgressBar;
