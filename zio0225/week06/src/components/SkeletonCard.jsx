import React from 'react';

const SkeletonCard = ({ count = 8 }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="lp-card skeleton">
          {/* 이미지 영역 스켈레톤 ㅡㅡ */}
          <div className="card-image skeleton-box"></div>
          
          {/* 텍스트 영역 스켈레톤 🥊 */}
          <div className="card-info">
            <div className="skeleton-text title"></div>
            <div className="skeleton-text date"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonCard;