const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

//Setting up Express
const app = express();

//Using public files
app.use(express.static("Public"));
//Using Body Parser
app.use(bodyParser.urlencoded({
    extended: true
}));


//Setting up server port
app.listen(3000, function () {
    console.log("Server is listening on port 3000");
});

//Routes
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});


app.post("/failure.html", function (req, res) {
    res.redirect("/");
});



app.post("/", function (req, res) {
    const userFirstName = req.body.firstname;
    const userLastName = req.body.lastname;
    const userEmail = req.body.email;

    const sentData = {
        members: [{
            email_address: userEmail,
            status: "subscribed",
            merge_fields: {
                FNAME: userFirstName,
                LNAME: userLastName
            }
        }]
    };

    const jsonData = JSON.stringify(sentData);

    const url = "https://us19.api.mailchimp.com/3.0/lists/604562b93e";

    const options = {
        method: "POST",
        auth: "marcio1:37743f2160c64126c1c72f609af631c8-us19"
    };

    const newRequest = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }


        response.on("data", function(receivedData) {
            var jsonRetorno = JSON.parse(receivedData);
            console.log(JSON.parse(receivedData));
        });


    });

    newRequest.write(jsonData);
    newRequest.end();
});