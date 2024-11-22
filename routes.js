const router=require('express').Router();
const am = require('./scapper')

//check
router.get('/check',(req,res)=>{
    res.send('server ready and running')
})



// Flipkart Live data 
router.post('/amazonlivedatabyurl',fk.amazonlivedatabyurl)

module.exports=router;