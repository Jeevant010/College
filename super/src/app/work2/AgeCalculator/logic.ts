export function getVotingStatus(birthYear: number): string {
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;
  const canVote = age >= 18;
  return `You are ${age} years old. Eligible to vote: ${canVote}`;
}