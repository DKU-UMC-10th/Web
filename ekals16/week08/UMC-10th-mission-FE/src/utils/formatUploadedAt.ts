const formatUploadedAt = (createdAt: Date | string) => {
  const createdTime = new Date(createdAt).getTime();

  if (Number.isNaN(createdTime)) {
    return "Unknown date";
  }

  const diffMinutes = Math.max(
    0,
    Math.floor((Date.now() - createdTime) / (1000 * 60)),
  );

  if (diffMinutes < 1) {
    return "just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} mins ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
};

export default formatUploadedAt;
