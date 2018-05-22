var express = require('express');
var app = express();

app.post('/log', function(req, res, next){
    req.assert('serial', 'Serial is required').notEmpty();
    req.assert('message', 'Message is required').notEmpty();

    var errors = req.validationErrors()

    if( !errors ) {
        var entry = {
            serial: req.sanitize('serial').escape().trim();
            message: req.sanitize('message').escape().trim();
        }

        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO log SET ?', entry, function(err, result) {
                if (err) {
                    req.flash('error', err);

                    res.render('log/add', {
                        title: 'Add new log entry';
                    })
                } else {
                    req.flash('success', 'Log entry recorded!');

                    res.render('log/add', {
                        title: 'Add new log entry',
                    })
                }
            })
        })
    }
    else {
        var error_msg = '';
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        });
        req.flash('error', error_msg);

        res.render('log/add', {
            title: 'Add new log entry'
        })
    }
});

app.get('/log', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM log', function(err, result) {
            if (err) {
                req.flash('error', err);
            } else {
                req.flash('success', 'Got Logs!');

                res.render('log', {
                    title: 'Add new log entry',
                })
            }
        })
    })
});

module.exports = app