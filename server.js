const express = require('express')
const shortId = require('shortid')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  try{
  var b=""
  if(req.body.sUrl.length===0)
  {
    b=shortId.generate()
  }
  else
  {
    b=req.body.sUrl
  }
  
  ShortUrl.findOne({short:b},function(err,sh){
    if(err){res.send(err)}
    if(sh){
      //  res.sendStatus(500)
    // console.log("already")
    }
    
  })
  await ShortUrl.create({ full: req.body.fullUrl,short: b })
 
 
  //  await ShortUrl.create({ full: req.body.fullUrl,short: req.body.sUrl })
  res.redirect('/')
}
catch(error){
  
   res.send("The shrinked path is already in use try another ")
  //  res.redirect('/')
}

})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000);