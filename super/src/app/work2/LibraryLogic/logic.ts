export function checkLibraryAccess(hasCard: boolean, isStudent: boolean): string {
  // Logic: You need a library card OR be a student to enter (Example logic)
  // OR: You need BOTH (Requirement says "decide if user can borrow")
  // Let's say: You need a Card AND (you must be a Student OR have paid fees - simplifed to just Card && Student for this example)
  
  if (hasCard && isStudent) {
    return "Access Granted: You can borrow books.";
  } else if (hasCard && !isStudent) {
     return "Access Denied: Only Students with cards can borrow.";
  } else {
    return "Access Denied: You need a library card and student status.";
  }
}