const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');   // uygulamanın görünğüm motorunu ejs olarak ayarladık
// Not: yeri burası olmalı. Değillse hata verir.

app.get("/", function(req, res){

    var today = new Date();
    var currentDay = today.getDay();
    var day = "";

    switch(currentDay){
        case 0:
            day = "Pazar";
            break;
        case 1:
            day = "Pazartesi";
            break;
        case 2:
            day = "Salı";
            break;
        case 3:
            day = "Çarşamba";
            break;
        case 4:
            day = "Perşembe";
            break;
        case 5:
            day = "Cuma";
            break;
        case 6:
            day = "Cumartesi";
           break;
        default:
            console.log("Error: current day is equal to: " + currentDay);
    }
    res.render("list",{kindOfDay: day});            // list.ejs dosyasına kindOfDay değişkenini değeriyle gönderir.

});



app.listen(3000, function(){
    console.log("Server started port 3000");
});