const express = require('express');
const router = express.Router();
const GlowieModel = require('./model/glowie')


router.get('/glowie', async(req, res)=>{
 try { 

    //geolocation
   /*const {lng,lat} = req.query;
   const glowie = await GlowieModel.aggregate([
     {
       $geoNear: {
         near: {
           type: "Point",
           coordinates: [parseFloat(lng), parseFloat(lat)],
         },
         distanceField: "distance",
         maxDistance: 100000,
         spherical: true,
       },
     },
   ]);*/
   const glowie = await GlowieModel.find({});
  res.status(200).json({ glowie });}
  catch(error){
    res.status(400).json({ error: error.message });
  }
})

router.get("/glowie/:id", async(req, res)=> {
  try {  const id = req.params.id;
   const glowie = await GlowieModel.findById({ _id: id });
  res.status(200).json({ glowie });}
  catch(error){
    res.status(400).json({ message: error.message });
  }
});


router.delete("/glowie/:id", async (req, res)=>{
  try {const id = req.params.id;
   const glowie = await GlowieModel.findOneAndDelete({_id:id});
  res.status(200).json({ glowie });}
  catch(error){
    res.status(400).json({ error: error.message });
  }
});

router.post("/glowie", async (req, res,next)=> {
   try {
   const glowie = await GlowieModel.create(req.body);
   console.log(glowie);
   res.status(200).json({ glowie }, req, res);}
   catch(error){
    res.status(400).json({ error: error.message }, req, res);
   }
});

router.put("/glowie/:id", async(req, res)=> {
   try { const id = req.params.id;
     const {name,rank, available} = req.body;
   const glowie = await GlowieModel.findByIdAndUpdate(
     { _id: id },
     { name, rank, available },
     { new: true }
   );
  res.status(200).json({ glowie });
}catch(error){
    res.status(400).json({ message: error.message });
}});

module.exports = router;