var express = require ('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var path = require('path');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: '5han7anu',
    password: 'pencil--14',
    database: 'Chirper'
});

var app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/')));

app.get('/chirps', function(req, res){
    res.sendFile(path.join(__dirname, '../client/list.html'));
});

app.get('/chirps/*/update', function(req, res){
    res.sendFile(path.join(__dirname, '../client/single_update.html'));
});

app.get('/chirps/*', function(req, res){
    res.sendFile(path.join(__dirname, '../client/single_view.html'));
});

app.get('/api/users', function(req, res){
    getUsers()
    .then(function(users){
        res.send(users);
    }, function(err){
        res.status(500).send(err);
    });
});

app.route('/api/chirps')
    .get(function(req, res){
        getAllChirps()
            .then(function(chirps){
                res.send(chirps);
            }, function(err){
                res.status(500).send(err);
            });
    })
    .post(function(req, res){
        postNewChirp(req.body.message, req.body.user)
        .then(function(id){
            res.status(201).send(id);
        }, function(err){
            res.status(500).send(err);
        });
    });

app.route('/api/chirps/:id')
    .get(function(req, res){
        getChirp(req.params.id)
        .then(function(requestedChirp){
            res.send(requestedChirp);
        }, function(err){
            res.status(500).send(err);
        });
    })
    .put(function(req, res){
        updateChirp(req.params.id, req.body.message)
        .then(function(){
            res.sendStatus(204);
        }, function(err){
            res.status(500).send(err);
        });
    })
    .delete(function(req, res){
        deleteChirp(req.params.id)
        .then(function(){
            res.sendStatus(204);
        }, function(err){
            res.status(500).send(err);
        });
    });
    
app.listen(3000);

function getAllChirps(){
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection){
            if(err){
                connection.release();
                reject(err);
            }else{
                connection.query('CALL GetAllChirps();', function(err, resultsets){
                    if(err){
                        connection.release();
                        reject(err);
                    }else{
                        connection.release();
                        resolve(resultsets[0]);
                    };
                });
            };
        });
    });
};

function postNewChirp(chirp, userId){
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection){
            if(err){
                connection.release();
                reject(err);
            }else{
                connection.query('CALL PostNewChirp(?, ?);', [chirp, userId], function(err, resultsets){
                    if(err){
                        connection.release();
                        console.log(err);
                        reject(err);
                    }else{
                        connection.release();
                        resolve(resultsets[0][0]);  
                    };
                });
            };
        });
    });
};

function getChirp(id){
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection){
            if(err){
                reject(err);
            }else{
                connection.query('CALL GetChirp(?);', [id], function(err, resultsets){
                    if(err){
                        connection.release();
                        reject(err);
                    }else{
                        connection.release();
                        resolve(resultsets[0][0]);
                    };
                })
            };
        })
    });
};

function updateChirp(id, message){
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection){
            if(err){
                reject(err);
            }else{
                connection.query('CALL UpdateChirp(?, ?);', [id, message], function(err, resultsets){
                    if(err){
                        connection.release();
                        reject(err);
                    }else{
                        connection.release();
                        resolve();
                    };
                })
            };
        })
    });
};

function deleteChirp(id){
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection){
            if(err){
                reject(err);
            }else{
                connection.query('CALL DeleteChirp(?);', [id], function(err, resultsets){
                    if(err){
                        connection.release();
                        reject(err);
                    }else{
                        connection.release();
                        resolve();
                    };
                })
            };
        })
    });
};

function getUsers(){
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection){
            if(err){
                connection.release();
                reject(err);
            }else{
                connection.query('CALL GetUsers();', function(err, resultsets){
                    if(err){
                        connection.release();
                        reject(err);
                    }else{
                        connection.release();
                        resolve(resultsets[0]);
                    };
                });
            };
        });
    });
};