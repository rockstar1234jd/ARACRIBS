// Aracribs - Currency Utilities (Indian Rupees Only)

export const formatPrice = (inrAmount) => {
  const num = Math.round(Number(inrAmount) || 0);
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(num);
  return `₹${formatted}`;
};

export const getDiscountedAmount = (amount, discountObj) => {
  if (!discountObj) return 0;
  if (discountObj.type === 'percentage') {
    return Math.round(amount * (discountObj.value / 100));
  }
  if (discountObj.type === 'fixed') {
    return Math.min(amount, discountObj.value);
  }
  return 0;
};
