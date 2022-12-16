export const timeStamp = (label: string, startTime: Date) => {
  if (!startTime) return;
  const now = new Date();
  console.log(`[${now.getTime() - startTime.getTime()}ms] ${label}`);
};
