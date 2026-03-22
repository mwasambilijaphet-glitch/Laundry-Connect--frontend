import { Star } from 'lucide-react';

export default function StarRating({ rating, size = 14, showNumber = true }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => {
          const filled = i <= Math.round(rating);
          return (
            <Star
              key={i}
              size={size}
              className={`transition-colors duration-200 ${
                filled
                  ? 'text-accent-500 fill-accent-500'
                  : 'text-slate-200 fill-slate-200'
              }`}
            />
          );
        })}
      </div>
      {showNumber && (
        <span className="text-sm font-bold text-slate-700 ml-0.5 tabular-nums">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
