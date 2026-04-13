const { error } = require('node:console');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        type:'OAuth2',
        user:process.env.EMAIL_USER,
        clientId:process.env.CLIENT_ID,
        clientSecret:process.env.CLIENT_SECRET,
        refreshToken:process.env.REFRESH_TOKEN
    },
});

//verify the connection configuration
transporter.verify(async(error, success)=>{
    if (error){
        console.error("error connecting to email services",error);
    }else{
        console.log("email server is ready to send message ");
    }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Arpan Karak" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail,name){
    const subject = "Welcome to Our Bank";
    const text = `Hello ${name},\n\nThank you for registering with our bank.`;
    const html = `<h1>Hello ${name},</h1><p>Thank you for registering with our bank.</p>`;
    await sendEmail(userEmail,subject,text,html);
}

async function transactionEmail(userEmail,name,amount,toAccount) {
  const subject = "Transacction Successful";
  const text = `Hello ${name},\n\nthe amount of ${amount} INR successfully transferred to account ${toAccount}`;
  const html = `<p> Hello ${name},</p><p>your transaction of ${amount} to account${toAccount} wass successful.</p><p>Best regards,<br>The Ledger Team</p>`
  await sendEmail(userEmail,subject,text,html); 
}
async function sendTransactionFail(userEmail,name,amount,toAccount) {
  const subject = "Transacction Failed";
  const text = `Hello ${name},\n\nthe amount of ${amount} INR is failed tp transfer to account ${toAccount}`;
  const html = `<p> Hello ${name},</p><p>your transaction of ${amount} to account${toAccount} wass failed.</p><p>Best regards,<br>The Ledger Team</p>`
  await sendEmail(userEmail,subject,text,html); 
  
}

module.exports = {
  sendRegistrationEmail,
  transactionEmail,
  sendTransactionFail
}

