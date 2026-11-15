/**
 * Generates a prefilled WhatsApp click-to-chat URL containing:
 * - Product name
 * - Product price in INR
 * - Product SKU
 * - Product URL
 */
export const buildWhatsAppEnquiryUrl = ({
  whatsappNumber = '919876543210',
  productName,
  price,
  sku,
  productUrl,
}) => {
  const cleanPhone = String(whatsappNumber).replace(/[^0-9]/g, '');
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price || 0);

  const message = [
    `Namaste AARANYA Concierge,`,
    `I would like to enquire about the following jewellery piece:`,
    `• Product: ${productName}`,
    `• Price: ${formattedPrice}`,
    `• SKU: ${sku}`,
    `• Link: ${productUrl}`,
    `Please share current showroom availability and viewing details.`,
  ].join('\n');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
