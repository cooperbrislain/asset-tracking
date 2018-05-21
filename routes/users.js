var express = require('express')
var app = express()

// SHOW LIST OF asset
app.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM asset ORDER BY id DESC',function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('asset/list', {
                    title: 'Asset List',
                    data: ''
                })
            } else {
                // render to views/asset/list.ejs template file
                res.render('asset/list', {
                    title: 'Asset List',
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
        title: 'Add New Asset',
        name: '',
        age: '',
        email: ''
    })
})

// ADD NEW asset POST ACTION
app.post('/add', function(req, res, next){
    req.assert('serial', 'Serial is required').notEmpty()           //Validate name

    var errors = req.validationErrors()

    if( !errors ) {

        var asset = {
            serial: req.sanitize('serial').escape().trim()
        }

        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO asset SET ?', asset, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)

                    // render to views/asset/add.ejs
                    res.render('asset/add', {
                        title: 'Add New Asset',
                        serial #: asset.serial
                    })
                } else {
                    req.flash('success', 'Data added successfully!')

                    // render to views/asset/add.ejs
                    res.render('asset/add', {
                        title: 'Add New Asset',
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
            title: 'Add New Asset',
            serial: req.body.serial
        })
    }
})

// SHOW EDIT asset FORM
app.get('/edit/(:serial)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM asset WHERE serial = ' + req.params.serial, function(err, rows, fields) {
            if(err) throw err

            // if asset not found
            if (rows.length <= 0) {
                req.flash('error', 'asset not found with serial = ' + req.params.serial)
                res.redirect('/asset')
            }
            else { // if asset found
                // render to views/asset/edit.ejs template file
                res.render('asset/edit', {
                    title: 'Edit Asset',
                    //data: rows[0],
                    serial: rows[0].serial
                })
            }
        })
    })
})

app.put('/edit/(:serial)', function(req, res, next) {
    req.assert('serial', 'Serial is required').notEmpty()

    var errors = req.validationErrors()

    if( !errors ) {
        var asset = {
            serial: req.sanitize('serial').escape().trim()
        }

        req.getConnection(function(error, conn) {
            conn.query('UPDATE asset SET ? WHERE serial = ' + req.params.serial, asset, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)

                    // render to views/asset/add.ejs
                    res.render('asset/edit', {
                        title: 'Edit Asset',
                        serial: req.params.serial
                    })
                } else {
                    req.flash('success', 'Data updated successfully!')

                    // render to views/asset/add.ejs
                    res.render('asset/edit', {
                        title: 'Edit Asset',
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
            title: 'Edit Asset',
            serial: req.params.serial
        })
    }
})

// DELETE asset
app.delete('/delete/(:serial)', function(req, res, next) {
    var asset = { serial: req.params.serial }

    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM asset WHERE serial = ' + req.params.serial, asset, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to asset list page
                res.redirect('/asset')
            } else {
                req.flash('success', 'Asset deleted successfully! serial = ' + req.params.serial)
                // redirect to asset list page
                res.redirect('/asset')
            }
        })
    })
})

module.exports = app