export function calcGrade(total) {
  if (total >= 80) return "A+";
  if (total >= 70) return "A";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  return "F";
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}