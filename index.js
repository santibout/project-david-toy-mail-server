const express = require("express");
const sgMail = require("@sendgrid/mail");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();

sgMail.setApiKey(process.env.SENDGRID_MAIL_SERVER_KEY);

app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  bodyParser.urlencoded({
    limit: "20mb",
    parameterLimit: 100000,
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.send("this is the home root");
});

app.post("/send", (req, res) => {
  console.log(req.body);
  const { img } = req.body;
  let htmlStr = "";
  req.body.map((x) => {
    for (let d in x) {
      if (d === "img") htmlStr += `<img src=${x[d]} />`;
      htmlStr += `<p>${d}: ${x[d]}</p>`;
    }
    htmlStr += "<br />";
  });
  console.log(htmlStr);
  const msg = {
    from: "samuel.santibout@gmail.com",
    to: [
      "santibout@yahoo.com",
      "david@kayoventures.com",
      "samuel.santibout@gmail.com",
    ],
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
