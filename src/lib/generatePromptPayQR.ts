export const generatePromptPayQR = async (amount: number) => {
  try {
    const promptpayId = process.env.PROMPTPAY_ID;

    const formatedAmount = amount.toFixed(2);

    const qrcodeDataUrl = `https://promptpay.io/${promptpayId}/${formatedAmount}`;

    return qrcodeDataUrl;
  } catch (error) {
    console.error("Error generating PromptPay QR: ", error);
    throw new Error("Can not create QR Code");
  }
};

generatePromptPayQR(1);
