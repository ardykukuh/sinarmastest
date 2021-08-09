const ResponseApi = require('../helper/response')   
const {movie,viewerandvoter} = require('../../models') 
const fs = require("fs")
const path = require("path");  
const { Op } = require('sequelize')
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const moment = require('moment') 
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');
 
const limit = 10;
const movieController = () => {   
    
    const url = async (req, res, next) => { 
        // req.params.filename
        var file = path.resolve(__dirname,"../uploads/"+req.params.filename);  
        if (!fs.existsSync(file)) {
            res.writeHead(404,{'Content-Type':'text/html'});
            return res.end("404 not found");
        }
        fs.readFile(file,function(err,data){
            if(err){
                res.writeHead(404,{'Content-Type':'text/html'});
                return res.end("404 not found");
            }
            res.writeHead(200,{'Content-Type':'video/mp4'});
            res.write(data); 
            res.end('<video src="'+data+'" controls></video>');
            
            // res.end();
        })    
        const token = req.token;
        try {
            jwt.verify(token,'secretkey', async (err,decodedToken)=> {  
                const watchUrl = 'http://localhost:3000/v1/movie/url/'+req.params.filename;
                const dtMovie = await movie.findOne({ where: { urlmovie: watchUrl } }); 
                await movie.update({viewed:dtMovie.viewed+1}, { where: { id: dtMovie.id } });
                await viewerandvoter.create( 
                    { user: decodedToken.user.email,idMovie:dtMovie.id,flag_vieworvote:'viewer' }
                );  
            })
        } catch(err) {
            return ResponseApi.errorResult(res, err)
        } 
    };
    const updateVoted = async (req, res, next) => { 
        req.checkParams('id', 'Params string id required').notEmpty()
        const error = req.validationErrors()
        if (error) {
            return ResponseApi.errorResult(res, error)
        }
        const token = req.token;
        try {
            jwt.verify(token,'secretkey', async (err,decodedToken)=> {  
                const id = req.params.id;
                const dtmovie = await movie.findOne({ where: { id: id } }); 
                const updatedMovie = await movie.update({voted:dtmovie.voted+1}, { where: { id: dtmovie.id } });
                await viewerandvoter.create( 
                    { user: decodedToken.user.email,idMovie:dtmovie.id,flag_vieworvote:'voter' }
                ); 
                return ResponseApi.dataResult(res, {message:decodedToken.user.email+' success voted'})
            })
        } catch(err) {
            return ResponseApi.errorResult(res, err)
        } 
         
    };
    const unVoted = async (req, res, next) => {
        req.checkParams('id', 'Params string id required').notEmpty()
        const error = req.validationErrors()
        if (error) {
            return ResponseApi.errorResult(res, error)
        }
        const token = req.token;
        try {
            jwt.verify(token,'secretkey', async (err,decodedToken)=> {  
                const id = req.params.id;
                const dtmovie = await movie.findOne({ where: { id: id } }); 
                await movie.update({voted:dtmovie.voted-1}, { where: { id: dtmovie.id } });
                await viewerandvoter.update( 
                    { flag_vieworvote:'unvoted' }, {where: {idMovie:dtmovie.id}} 
                ); 
                return ResponseApi.dataResult(res, {message:decodedToken.user.email+' success unvoted'})
            })
        } catch(err) {
            return ResponseApi.errorResult(res, err)
        } 
    };


    //Admin API Add Movie
    const addMovie = async (req, res, next) => {  
        req.checkBody("title", "Please fill out a Title").notEmpty();
        req.checkBody("description", "Please fill out a Description").notEmpty();
        req.checkBody("duration", "Please fill out a Duration").notEmpty();
        req.checkBody("artists", "Please fill out a Artists").notEmpty(); 
        req.checkBody("genres", "Please fill out a Genres").notEmpty(); 
        const error = req.validationErrors()
        if (error) {
            return ResponseApi.errorResult(res, error)
        }
        const filePath = `${req.file.destination}/${req.file.filename}`
        try { 
            let user = await movie.create( 
              Object.assign(req.body, { urlmovie: 'http://localhost:3000/v1/movie/url/'+req.file.filename })
            );  
            return ResponseApi.dataResult(res, user) 
        } catch(err) {
            return ResponseApi.errorResult(res, err)
        } 
    };
    //Admin API Update Movie
    const updateMovie = async (req, res, next) => {  
        req.checkBody("title", "Please fill out a Title").notEmpty();
        req.checkBody("description", "Please fill out a Description").notEmpty();
        req.checkBody("duration", "Please fill out a Duration").notEmpty();
        req.checkBody("artists", "Please fill out a Artists").notEmpty(); 
        req.checkBody("genres", "Please fill out a Genres").notEmpty(); 
        req.checkParams('id', 'Params string id required').notEmpty()
        const error = req.validationErrors()
        if (error) {
            return ResponseApi.errorResult(res, error)
        }
        const filePath = `${req.file.destination}/${req.file.filename}`
        try { 
            let user = await movie.update( 
                Object.assign(req.body, { urlmovie: 'http://localhost:3000/v1/movie/url/'+req.file.filename })
            ,{
                where: { id: req.params.id }  
            });  
            return ResponseApi.dataResult(res, user) 
        } catch(err) {
            return ResponseApi.errorResult(res, err)
        } 
    }; 
                
    //Admin API Most Viewed Movie
    const mostViewedMovie = async (req, res, next) => { 
        try {
            let dtmovie = await movie.findAll({  
                order:[
                    ['viewed', 'DESC']
                ]
            }) 
            return ResponseApi.dataResult(res, dtmovie) 
        } catch(err) {
            return ResponseApi.errorResult(res, err)
        } 
    };
    //Admin API Most Viewed Genre
    const mostViewedGenre = async (req, res, next) => { 
        try {
            let dtmovie = await movie.findAll({  
                attributes:[[Sequelize.fn('SUM', Sequelize.col('voted')),'voted'],'genres'],
                group: ['genres', 'voted']
            }) 
            return ResponseApi.dataResult(res, dtmovie) 
        } catch(err) {
            return ResponseApi.errorResult(res, err)
        } 
    };

    
    //All Users API track movie viewership
    const movieViewership = async (req, res, next) => { 
        try {
            let dtmovie = await viewerandvoter.findAll({  
                attributes:[[Sequelize.fn('COUNT', Sequelize.col('user')),'countViews'],'user','idMovie'],
                where: {flag_vieworvote:'viewer'}, 
                group: ['user', 'idMovie']  
            }) 
            return ResponseApi.dataResult(res, dtmovie) 
        } catch(err) {
            return ResponseApi.errorResult(res, err)
        } 
    };
    //All Users API track list movie voters
    const movieVoters = async (req, res, next) => { 
        try {
            let dtmovie = await viewerandvoter.findAll({  
                attributes:[[Sequelize.fn('COUNT', Sequelize.col('user')),'countVotes'],'user','idMovie','flag_vieworvote'],
                where: {
                    flag_vieworvote:'voter'
                }, 
                group: ['user', 'idMovie']  
            }) 
            return ResponseApi.dataResult(res, dtmovie) 
        } catch(err) {
            return ResponseApi.errorResult(res, err)
        } 
    };
    
    
    //All Users API list Movie
    const listMovie = async (req, res, next) => { 
        const page = req.query.page;
        const limit = req.query.limit ? req.query.limit : 10; 
        const offset = req.query.page === undefined ? 0 : parseInt(req.query.page-1) * limit;
        
        try {
            let dtmovie = await movie.findAndCountAll({
                limit,
                offset,
                order:[
                    ['createdAt', 'DESC']
                ]
            })
            
            const { count: totalItems,rows:rows } = dtmovie;
            const currentPage = page ? +page : 1;
            const totalPages = Math.ceil(totalItems / limit);
 
            return ResponseApi.dataResult(res, { totalItems, rows, totalPages, currentPage }) 
        } catch(err) {
            return ResponseApi.errorResult(res, err)
        } 
    }; 

    //All Users API search Movie
    const searchMovie = async (req, res, next) => { 
        const page = req.query.page;
        const limit = req.query.limit ? req.query.limit : 10; 
        const offset = req.query.page === undefined ? 0 : parseInt(req.query.page-1) * limit;
        try {
            let dtmovie = await movie.findAndCountAll({
                limit,
                offset,
                where: { 
                    [Op.or]:[
                        {
                            title: {
                                [Op.like]: '%'+req.query.search+'%', 
                            },
                        },{
                            description: {
                                [Op.like]: '%'+req.query.search+'%', 
                            }
                        },{
                            artists: {
                                [Op.like]: '%'+req.query.search+'%', 
                            }
                        },{
                            genres: {
                                [Op.like]: '%'+req.query.search+'%', 
                            }
                        },
                    ]
                },
                order:[
                    ['createdAt', 'DESC']
                ]
            })
            
            const { count: totalItems,rows:rows } = dtmovie;
            const currentPage = page ? +page : 1;
            const totalPages = Math.ceil(totalItems / limit);
 
            return ResponseApi.dataResult(res, { totalItems, rows, totalPages, currentPage }) 
        } catch(err) {
            return ResponseApi.errorResult(res, err)
        } 
    }; 
      
    return {
        addMovie,
        updateMovie,
        listMovie,
        searchMovie,
        url,
        updateVoted,
        unVoted,
        mostViewedMovie,
        mostViewedGenre,
        movieViewership,
        movieVoters
    }
} 
module.exports = movieController;