var mongoose = require('mongoose')
var dbURL = "mongodb+srv://anjali:admin@atlascluster.hpsbk5v.mongodb.net/?retryWrites=true&w=majority";
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var cors = require('cors')

app.use(cors())
app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//connection to MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        // Continue with your server setup or other actions after successful connection
        var server = app.listen(3002, () => {
            console.log('Server is listening on port : ', server.address().port);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

//MongoDB object
var Product = mongoose.model('product', {
    "id": Number,
    "product": {
       "productid": Number,
       "category": String,
       "price": Number,
       "name": String,
       "instock": Boolean
    }
})

//Get Products API
app.get('/product/get/', (req, res) => {
    Product.find({}, (err, products) => {
        let productsToDisplay = {};
        products.forEach((prod) => {            
            productsToDisplay[prod.id] = prod;
        })
        res.send(productsToDisplay)
    })
})

//Create Product API
app.post('/product/create', (req, res) => {
    var product = new Product(req.body)
    product.save((err) => {
        if(err) {
            res.sendStatus(500)
        } else {
            res.sendStatus(200)
        }
    })
})

//Update Product API
app.post('/product/update/:id', (req, res) => {
    Product.updateOne(req.params, req.body, (err, data) => {
        res.redirect('/product/get');        
    })
})

//Delete Product API
app.get('/product/delete/:id', (req, res) => {
    Product.deleteOne(req.params, (err, data) => {
        res.redirect('/product/get');        
    })  
})

//Server is running on port 3003 and client is running on port 3000
var server = app.listen(3003, () => {
    console.log('Server is listening on port : ', server.address().port)
})