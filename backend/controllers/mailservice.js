const nodemailer = require("nodemailer");

// 🔹 Configure Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "your-email@gmail.com",  // Change to your email
        pass: "your-app-password",     // Use an App Password (Not your email password)
    },
});

// 📧 Function to Send an Email
const sendDeliveryEmail = async (order) => {
    if (!order || !order.customerEmail) return;
    
    const mailOptions = {
        from: "your-email@gmail.com",
        to: order.customerEmail, // Customer's email
        subject: "Your Order has been Delivered!",
        html: `<h2>Hello, ${order.customerName}!</h2>
               <p>Your order <strong>${order._id}</strong> has been successfully delivered.</p>
               <p>Thank you for shopping with us!</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${order.customerEmail}`);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

// Export the function to be used in other files
module.exports = { sendDeliveryEmail };
