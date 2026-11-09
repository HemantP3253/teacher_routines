import { useEffect, useState } from "react";

const getGreeting = (hour: number) => {
  if (hour <= 5) return "Goodnight";
  if (hour <= 11) return "Good morning";
  if (hour <= 17) return "Good afternoon";
  if (hour <= 21) return "Good evening";
  return "Goodnight";
};

export const useDynamicGreeting = () => {
  const [greeting, setGreeting] = useState<string>(() => {
    return getGreeting(new Date().getHours());
  });

  useEffect(() => {
    let timeoutId: number;

    const scheduleNextUpdate = () => {
      const now = new Date();
      const currentHour = now.getHours();

      const boundaries = [6, 12, 18, 22];

      const nextBoundaryHour = boundaries.find(
        (boundary) => boundary > currentHour,
      );

      const target = new Date();
      if (nextBoundaryHour !== undefined) {
        target.setHours(nextBoundaryHour, 0, 0, 0);
      } else {
        target.setDate(target.getDate() + 1);
        target.setHours(6, 0, 0, 0);
      }

      const msUntilNextChange = target.getTime() - now.getTime();

      timeoutId = setTimeout(() => {
        setGreeting(getGreeting(new Date().getHours()));
        scheduleNextUpdate();
      }, msUntilNextChange);

      scheduleNextUpdate();

      return () => clearTimeout(timeoutId);
    };
  }, []);

  return greeting;
};
