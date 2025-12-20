import Car from '../models/car.js';

export default function(req,res){
     Car.find({},{_id:0,__v:0}).then(i=>{
          return res.status(200).send(i);
     }).catch(e=>{
          return res.status(404).send([{error:e}]);
     });
}