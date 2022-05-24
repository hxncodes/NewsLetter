const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        },
      },
    ],
  };

  var jsonData = JSON.stringify(data);

  const url = "https://us18.api.mailchimp.com/3.0/lists/e6baaf08fb";
  const options = {
    method: "POST",
    auth: "hxncodes:d040b336fe376f7885359f016c3b7684-us18",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

// app.post("/redirect", function (req, res) {
//   res.redirect("/");
// });

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started at Heroku or Port 3000");
});
