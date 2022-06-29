const express = require('express');
const cors = require("cors");
const app = express();
const port = 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const corsOptions = {
    "origin": "http://localhost:3000",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  }
app.use(cors(corsOptions))


//API CONTRACT EXAMPLE
// {
//     "journalists": [
//         {
//             "id": 1,
//             "name": "Journo1",
//             "weightX": -3,
//             "weightY": 1
//         },
//         {
//             "id": 2,
//             "name": "Journo2",
//             "weightX": -1,
//             "weightY": 1
//         }
//     ]
// }

let journalist_spectrum = [];

app.get('/', (request, response) => {
    response.send('Hello from Express!')
})

app.post('/journalism_spectrum', function (req, res) {

    req.body.journalists.forEach((journalist) => {
        let curIndex = journalist_spectrum.findIndex( j => j.id === journalist.id);
        let curJourno = {};
        if(curIndex >= 0) //found
        {
            curJourno = journalist_spectrum.splice( curIndex, 1)[0];
            curJourno.avg_weightX = ((curJourno.avg_weightX * curJourno.no_of_voters) + journalist.weightX) / (curJourno.no_of_voters + 1) ;
            curJourno.avg_weightY = ((curJourno.avg_weightY * curJourno.no_of_voters) + journalist.weightY) / (curJourno.no_of_voters + 1) ;
            curJourno.no_of_voters ++;
        } else 
        {
            curJourno.id = journalist.id;
            curJourno.name = journalist.name;
            curJourno.avg_weightX = journalist.weightX;
            curJourno.avg_weightY = journalist.weightY;
            curJourno.no_of_voters = 1;
            
        }
        journalist_spectrum = [...journalist_spectrum, curJourno];
    });

    res.send(JSON.stringify(journalist_spectrum));
});

app.use((err, request, response, next) => {
    // log the error, for now just console.log
    console.log(err)
    response.status(500).send('Something broke!')
})

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
})


