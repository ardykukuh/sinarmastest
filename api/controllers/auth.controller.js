const ResponseApi = require('../helper/response')     
const {User} = require('../../models')  
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authController = () => {   
    //New user can self-registration on platform by providing, email, password 
    const registerUser = async (req,res,next) => { 
        req.checkBody("email", "Invalid Email").notEmpty();
        req.checkBody("password", "Invalid Password").notEmpty();
        const error = req.validationErrors()
        if (error) {
            return ResponseApi.errorResult(res, error)
        }
        const hash = bcrypt.hashSync(req.body.password, 10); 
        try {
          // create a new user with the password hash from bcrypt
          let user = await User.create( 
            Object.assign(req.body, { password: hash })
          ); 

          return ResponseApi.dataResult(res, 'success registered')
        } catch(err) {
            return ResponseApi.errorResult(res, err)
        }
      
    };
    //User MUST login to call all APIs on platform.
    const loginUser = async (req,res,next) => {
        const { email, password } = req.body;
        req.checkBody("email", "Invalid Email & Password").notEmpty();
        req.checkBody("password", "Invalid Email & Password").notEmpty();
        const error = req.validationErrors()
        if (error) {
            return ResponseApi.errorResult(res, error)
        }
        try {
            let user = await User.authenticate(email, password)
          
            jwt.sign({user:user}, 'secretkey', (err,token)=>{   
                return ResponseApi.dataResult(res, {
                    id:user.id,
                    email:user.email,
                    token:token 
                })
            }) 
        } catch (err) {
            return ResponseApi.errorResult(res, err);
        }  
        
    }
    return {
        loginUser,
        registerUser
    }
}
module.exports = authController;