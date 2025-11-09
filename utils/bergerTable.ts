/**
 * Generates a round-robin schedule for a list of teams using the Berger Table algorithm.
 * Handles both even and odd numbers of teams by adding a "bye" team if necessary.
 *
 * @param teams An array of team objects. Each object must have an `id` property.
 * @returns An array of rounds. Each round is an array of match pairings.
 *          Each match pairing is an object with `home` and `away` properties, containing team objects.
 *          If a team has a bye, the pairing will include a team with id 'bye'.
 */
export const generateBergerTable = <T extends { id: string }>(teams: T[]): { home: T | { id: 'bye' }; away: T | { id: 'bye' } }[][] => {
  let participants = [...teams];
  const hasBye = participants.length % 2 !== 0;

  // If the number of teams is odd, add a placeholder for a "bye" week.
  if (hasBye) {
    participants.push({ id: 'bye' } as T);
  }

  const teamCount = participants.length;
  const roundsCount = teamCount - 1;
  const halfCount = teamCount / 2;

  const schedule: { home: T | { id: 'bye' }; away: T | { id: 'bye' } }[][] = [];

  // Split teams into two halves for pairing.
  let topHalf = participants.slice(0, halfCount);
  let bottomHalf = participants.slice(halfCount).reverse();

  for (let round = 0; round < roundsCount; round++) {
    const currentRound: { home: T | { id: 'bye' }; away: T | { id: 'bye' } }[] = [];

    for (let i = 0; i < halfCount; i++) {
      // Alternate home/away advantage for the first team in the pairing.
      // This ensures the fixed team (participants[0]) gets balanced home/away games.
      if (round % 2 === 0) {
        currentRound.push({ home: bottomHalf[i], away: topHalf[i] });
      } else {
        currentRound.push({ home: topHalf[i], away: bottomHalf[i] });
      }
    }
    schedule.push(currentRound);

    // --- Rotate the teams for the next round ---
    // The first team (participants[0]) is fixed in its position.
    // The other teams rotate around it in a clockwise manner.

    // 1. The last element of the top half moves to the start of the bottom half.
    const lastTop = topHalf.pop()!;
    bottomHalf.unshift(lastTop);

    // 2. The first element of the bottom half moves to the second position of the top half.
    const firstBottom = bottomHalf.pop()!;
    topHalf.splice(1, 0, firstBottom);
  }

  return schedule;
};
