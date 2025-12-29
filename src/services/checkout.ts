/**
 * eslint-disable @typescript-eslint/no-explicit-any
 *
 * @format
 */

import emailjs from "emailjs-com";

const EMAIL_PUBLIC_KEY = "PVVkJyq_LdxNGmNBV";

export const sendEmail = async (
  templateParams: any,
  serviceId: string,
  templateId: string
) => {
  return emailjs.send(serviceId, templateId, templateParams, EMAIL_PUBLIC_KEY);
};

export const generateOrderNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const randomDigits = Math.floor(1000 + Math.random() * 9000);

  return `CMD-${year}${month}${day}-${randomDigits}`;
};
