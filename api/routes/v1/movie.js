let Route = express.Router()
const controllers = require('../../controllers'); 
const movieController = controllers.movieController()
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'api/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
})  
function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization']
    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(' ')[1]
        req.token = bearerToken
        next()
    }else {
        res.sendStatus(401)
    }
} 
Route.post('/addMovie',multer({ storage }).single('file'),verifyToken, movieController.addMovie) 
.put('/updateMovie/:id',verifyToken, movieController.updateMovie) 
.get('/listMovie',verifyToken, movieController.listMovie) 
.get('/searchMovie',verifyToken, movieController.searchMovie) 
.get('/url/:filename',verifyToken, movieController.url) 
.get('/mostViewedMovie',movieController.mostViewedMovie) 
.get('/mostViewedGenre',movieController.mostViewedGenre) 
.get('/movieViewership',movieController.movieViewership) 
.get('/movieVoters',movieController.movieVoters) 
.put('/updateVoted/:id',verifyToken, movieController.updateVoted) 
.put('/unVoted/:id',verifyToken, movieController.unVoted) 



module.exports = Route