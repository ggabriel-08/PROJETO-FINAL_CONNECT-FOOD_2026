import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  initialRating?: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  initialRating = 0,
  onRate,
  readonly = false,
}) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleClick = (value: number) => {
    if (readonly) return;
    setRating(value);
    if (onRate) onRate(value);
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverRating || rating);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            className={`p-1 rounded-md transition-colors ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            }`}
          >
            <Star
              className={`w-7 h-7 transition-colors ${
                isFilled
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-gray-300 fill-transparent'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
