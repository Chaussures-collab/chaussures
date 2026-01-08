/** @format */

import React, { useState, useEffect } from "react";
import Typography from "@/ui/designSystem/typography/typography";
import { FiClock, FiPercent } from "react-icons/fi";

interface LimitedTimeDiscountProps {
  discountPercentage: number;
  endDate: Date;
  className?: string;
}

export default function LimitedTimeDiscount({
  discountPercentage,
  endDate,
  className = ""
}: LimitedTimeDiscountProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = endDate.getTime();
      const difference = end - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  if (isExpired) {
    return null;
  }

  return (
    <div
      className={`bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg p-3 md:p-4 shadow-lg ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-1.5 md:p-2 bg-white/20 rounded-lg">
            <FiPercent className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <div>
            <Typography variant="body" className="text-sm md:text-base font-bold">
              Réduction limitée : -{discountPercentage}%
            </Typography>
            <Typography variant="caption1" className="text-xs md:text-sm text-white/90">
              Offre se termine bientôt !
            </Typography>
          </div>
        </div>

        {timeLeft && (
          <div className="flex items-center gap-1 md:gap-2">
            <FiClock className="w-4 h-4 md:w-5 md:h-5" />
            <div className="flex gap-1 md:gap-2 text-xs md:text-sm font-mono font-bold">
              {timeLeft.days > 0 && (
                <div className="bg-white/20 px-1.5 md:px-2 py-1 rounded">
                  {String(timeLeft.days).padStart(2, "0")}j
                </div>
              )}
              <div className="bg-white/20 px-1.5 md:px-2 py-1 rounded">
                {String(timeLeft.hours).padStart(2, "0")}h
              </div>
              <div className="bg-white/20 px-1.5 md:px-2 py-1 rounded">
                {String(timeLeft.minutes).padStart(2, "0")}m
              </div>
              <div className="bg-white/20 px-1.5 md:px-2 py-1 rounded">
                {String(timeLeft.seconds).padStart(2, "0")}s
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

