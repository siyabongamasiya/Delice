export function formatPrice(price: number): string {
  return `R${price.toFixed(2)}`;
}

export function formatDate(date: string): string {
  // Format as YYYY-MM-DD or localize as needed
  return new Date(date).toLocaleDateString("en-ZA");
}

export function formatPhone(phone: string): string {
  // South African phone formatting
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
}
