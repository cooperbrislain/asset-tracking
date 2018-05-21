var express = require('express')
var app = express()

// SHOW LIST OF assetS
app.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM assets ORDER BY seriial DESC',function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('asset/list', {
                    title: 'asset List',
                    data: ''
                })
            } else {
                // render to views/asset/list.ejs template file
                res.render('asset/list', {
                    title: 'asset List',
                    data: rows
                })
            }
        })
    })
})

// SHOW ADD asset FORM
app.get('/add', function(req, res, next){
    // render to views/asset/add.ejs
    res.render('asset/add', {
        title: 'Add New asset',
        serial:  ''
    })
})

// ADD NEW asset POST ACTION
app.post('/add', function(req, res, next){
    req.assert('serial', 'Serial is required').notEmpty()


    var errors = req.validationErrors()

    if( !errors ) {
        var asset = {
            serial: req.sanitize('serial').escape().trim()
        }

        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO assets SET ?', asset, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)

                    // render to views/asset/add.ejs
                    res.render('asset/add', {
                        title: 'Add New asset',
                        name: asset.serial
                    })
                } else {
                    req.flash('success', 'Data added successfully!')

                    // render to views/asset/add.ejs
                    res.render('asset/add', {
                        title: 'Add New asset',
                        serial: ''
                    })
                }
            })
        })
    }
    else {   //Display errors to asset
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        /**
         * Using req.body.name
         * because req.param('name') is deprecated
         */
        res.render('asset/add', {
            title: 'Add New asset',
            name: req.body.serial
        })
    }
})

// SHOW EDIT asset FORM
app.get('/edit/(:serial)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM assets WHERE serial = ' + req.params.serial, function(err, rows, fields) {
            if(err) throw err

            // if asset not found
            if (rows.length <= 0) {
                req.flash('error', 'asset not found with serial = ' + req.params.serial)
                res.redirect('/assets')
            }
            else { // if asset found
                // render to views/asset/edit.ejs template file
                res.render('asset/edit', {
                    title: 'Edit asset',
                    //data: rows[0],
                    serial: rows[0].serial
                })
            }
        })
    })
})

// EDIT asset POST ACTION
app.put('/edit/(:serial)', function(req, res, next) {

    var errors = req.validationErrors()

    if( !errors ) {
        var asset = {
        }

        req.getConnection(function(error, conn) {
            conn.query('UPDATE assets SET ? WHERE serial = ' + req.params.serial, asset, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)

                    // render to views/asset/add.ejs
                    res.render('asset/edit', {
                        title: 'Edit asset',
                        serial: req.params.serial
                    })
                } else {
                    req.flash('success', 'Data updated successfully!')

                    // render to views/asset/add.ejs
                    res.render('asset/edit', {
                        title: 'Edit asset',
                        serial: req.params.serial
                    })
                }
            })
        })
    }
    else {   //Display errors to asset
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        /**
         * Using req.body.name
         * because req.param('name') is deprecated
         */
        res.render('asset/edit', {
            title: 'Edit asset',
            serial: req.params.serial,
            name: req.body.name,
            age: req.body.age,
            email: req.body.email
        })
    }
})

// DELETE asset
app.delete('/delete/(:serial)', function(req, res, next) {
    var asset = { serial: req.params.serial }

    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM assets WHERE serial = ' + req.params.serial, asset, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to assets list page
                res.redirect('/assets')
            } else {
                req.flash('success', 'asset deleted successfully! serial = ' + req.params.serial)
                // redirect to assets list page
                res.redirect('/assets')
            }
        })
    })
})

module.exports = app