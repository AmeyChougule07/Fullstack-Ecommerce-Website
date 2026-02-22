import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOrderEmail = async (email, orderId, amount) => {
  try {

    const mailOptions = {
      from: `"Forever Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ Your Order Has Been Placed!",
      html: `
        <div style="font-family: Arial; padding:20px">
          <h2>Thank you for your order 🛍️</h2>

          <p>Your order has been placed successfully.</p>

          <h3>Order Details:</h3>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Total Amount:</strong> ₹${amount}</p>

          <br/>
          <p>We will notify you once your order is shipped.</p>

          <hr/>
          <p>Forever Store ❤️</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Order email sent");

  } catch (error) {
    console.log("Email Error:", error.message);
  }
};