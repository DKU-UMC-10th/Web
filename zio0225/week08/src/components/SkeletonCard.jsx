import React from 'react';

const SkeletonCard = ({ count = 8 }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-4 shadow-[0_30px_120px_-90px_rgba(255,255,255,0.35)] animate-pulse"
        >
          <div className="aspect-square w-full overflow-hidden rounded-[2rem] bg-zinc-900" />
          <div className="mt-4 space-y-3">
            <div className="h-4 w-3/4 rounded-full bg-zinc-900" />
            <div className="h-3 w-1/2 rounded-full bg-zinc-900" />
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonCard;