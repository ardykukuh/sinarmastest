let Route = express.Router()
const controllers = require('../../controllers'); 
const authController = controllers.authController()
Route.post('/loginUser', authController.loginUser)
.post('/registerUser', authController.registerUser)

module.exports = Route