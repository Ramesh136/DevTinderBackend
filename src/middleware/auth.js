const authUser = (req,res,next)=>{
  if(req.query.token === 'x9x9'){
    next()
  }
  else{
    res.status(401).send("Please Login")
  }
}

module.exports = { authUser}