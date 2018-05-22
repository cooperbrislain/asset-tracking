var express = require('express')
var app = express()

app.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM asset ORDER BY seriial DESC',function(err, rows, fields) {
            if (err) {
                req.flash('error', err)
                res.render('asset/list', {
                    title: 'asset List',
                    data: ''
                })
            } else {
                res.render('asset/list', {
                    title: 'asset List',
                    data: rows
                })
            }
        })
    })
})

app.get('/asset/checkin/(:serial)', function(req, res, next) {
    res.render('asset/checkin', {
        title: 'Check In',
        serial: req.body.serial
    });
});

app.get('/asset/add', function(req, res, next){
    res.render('asset/add', {
        title: 'Add New asset',
        serial:  ''
    })
})

app.post('/asset/add', function(req, res, next){
    req.assert('serial', 'Serial is required').notEmpty()


    var errors = req.validationErrors()

    if( !errors ) {
        var asset = {
            serial: req.sanitize('serial').escape().trim()
        }

        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO asset SET ?', asset, function(err, result) {
                if (err) {
                    req.flash('error', err)

                    res.render('asset/add', {
                        title: 'Add New asset',
                        name: asset.serial
                    })
                } else {
                    req.flash('success', 'Data added successfully!')

                    res.render('asset/add', {
                        title: 'Add New asset',
                        serial: ''
                    })
                }
            })
        })
    }
    else {
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        res.render('asset/add', {
            title: 'Add New asset',
            serial: req.body.serial
        })
    }
})

app.get('/asset/edit/(:serial)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM asset WHERE serial = ' + req.params.serial, function(err, rows, fields) {
            if(err) throw err
            if (rows.length <= 0) {
                req.flash('error', 'asset not found with serial = ' + req.params.serial)
                res.redirect('/asset')
            }
            else {
                res.render('asset/edit', {
                    title: 'Edit asset',
                    serial: rows[0].serial
                })
            }
        })
    })
})

app.put('/asset/edit/(:serial)', function(req, res, next) {

    var errors = req.validationErrors()

    if( !errors ) {
        var asset = {
        }

        req.getConnection(function(error, conn) {
            conn.query('UPDATE asset SET ? WHERE serial = ' + req.params.serial, asset, function(err, result) {
                if (err) {
                    req.flash('error', err)

                    res.render('asset/edit', {
                        title: 'Edit asset',
                        serial: req.params.serial
                    })
                } else {
                    req.flash('success', 'Data updated successfully!')

                    res.render('asset/edit', {
                        title: 'Edit asset',
                        serial: req.params.serial
                    })
                }
            })
        })
    }
    else {
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        res.render('asset/edit', {
            title: 'Edit asset',
            serial: req.params.serial,
            name: req.body.name,
            age: req.body.age,
            email: req.body.email
        })
    }
})

app.delete('/asset/delete/(:serial)', function(req, res, next) {
    var asset = { serial: req.params.serial }

    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM asset WHERE serial = ' + req.params.serial, asset, function(err, result) {
            if (err) {
                req.flash('error', err)
                res.redirect('/asset')
            } else {
                req.flash('success', 'asset deleted successfully! serial = ' + req.params.serial)
                res.redirect('/asset')
            }
        })
    })
})

module.exports = app