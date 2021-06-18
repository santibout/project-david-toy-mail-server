const express = require("express");
const sgMail = require("@sendgrid/mail");
const bodyParser = require("body-parser");
// const cors = require("cors");

require("dotenv").config();
const app = express();

sgMail.setApiKey(process.env.SENDGRID_MAIL_SERVER_KEY);
console.log(process.env.SENDGRID_MAIL_SERVER_KEY);

// app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   console.log("hi");
//   res.send("this is the home root");
// });
// body.map((x) => {
//   for (let d in x) {
//     if (d === "img") htmlStr += `<img src=${x[d]} />`;
//     htmlStr += `<p>${d}: ${x[d]}</p>`;
//   }
//   htmlStr += "<br />";
// });
function generateHtmlString(body) {
  let output = "";
  for(let i = 0; i < body.length; i++){
    output += `
      <div style="border: 1px solid black">
      <h2>Hi, ${body[i].email}</h2>
      <p>is amazon fresh customer: ${body[i].isAmazonFresh}</p>
      <a src=${body.amazonURL}>${body[i].amazonURL}</a>
      <p>Is amazon prime customer: ${body[i].isAmazonPrime}</p>
      <p>Is selected: ${body[i].isSelected}</p>
      <p>title: ${body[i].title}</p>
      <p>Image: ${body[i].fileUrlPath}</p>
      <img src=${body[i].fileUrlPath} />
      </div>
    `
  }
  return output;
}
app.post("/send", (req, res) => {
  console.log(req.body);
  const {
    email,
    isAmazonFresh,
    amazonURL,
    isAmazonPrime,
    isSelected,
    title,
    fileUrlPath,
  } = req.body;
  const htmlStr = generateHtmlString(req.body);
  console.log(htmlStr);
  const msg = {
    from: "samuel.santibout@gmail.com",
    to: ["santibout@yahoo.com", "david@kayoventures.com", `${email}`],
    subject: "Mail Server",
    html: htmlStr,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.log("error trying to send email");
      console.error(error);
    });
  res.send("send post done");
});

app.listen(process.env.PORT || 3201, () =>
  console.log("Project David Mail Server Is Live")
);
