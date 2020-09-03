const sgMail = require("@sendgrid/mail");

//https://www.digitaldesignjournal.com/best-password-reset-request-email-template/
//https://github.com/sendgrid/email-templates/blob/master/paste-templates/password-reset.html
const htmlTemplate = (data) => {
  let html = ``;
  html = `<!DOCTYPE html>
  <html>
  <head>
  <title>Contact from user.</title>
  <style>
  * {
    margin: 0;
      padding: 0;
      box-sizing: border-box;
  }
  
  body {
  
      font-family: Impact, Charcoal, sans-serif;
      font-size: 15px;
  }
  
  .container {
    width: 100%;
      padding: 20px;
      background-color: #ccc;
  }
  
  .box {
    width: 100%;
      background-color: white;
      padding: 20px;
      border-radius: 5px;
  }
  
  .msg-header {
    background-color: #2196f3;
      padding: 5px 10px;
      width: 100%;
      color: white;
      display: block;
      text-align: center;
      margin-top: 30px;
  }
  
  p {
    margin: 15px 0;
  }
  
  .footer {
    font-size: 75%;
  }
  
  .email-footer {
    text-align: center;
      padding: 40px 0;
  }
  </style>
  </head>
  <body>
  <div class="msg-header">
    NEO TEC.
  </div>
  <div class="container">
    <div class="box">
      <h1>Message from user.</h1>
        <p>Name: ${data.name}</p>
        <p>Email: ${data.email}</p>
        <p>Phone: ${data.phone}</p>
        <p>Message: ${data.msg}</p>
    </div>
    <div class="email-footer">
      <p class="footer">
        Neo Tec Solutions Pvt Ltd.
      </p>
      <p class="footer">${process.env.FRONTEND_HOMEPAGE}</p>
    </div>
  </div>
  </body>
  </html>`;
  return html;
};

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (data) => {
  const msg = {
    to: "info@ntslk.com",
    from: data.email,
    subject: data.subject,
    html: htmlTemplate(data)
  };
  sgMail.send(msg);
};

module.exports = sendEmail;
