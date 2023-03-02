'use strict'

const http = require('http').createServer(serverUpload)
const util = require('util')
const formidable = require('formidable')
const fse = require('fs-extra')

function serverUpload(req, res){

    if(req.method.toLowerCase() == 'get'){
        let form = `
            <h2> Sube tu archivo </h2>
            <form action="/upload" enctype="multipart/form-data" method="POST">
                <div><input type="file" name="fileUpload" required></div>
                <div><input type="submit" value="Subir"></div>
            </form>
        `

        res.writeHead(200, {'Content-Type' : 'text/html'})
        res.end(form)

    }

    if(req.method.toLowerCase() == 'post' && req.url == '/upload'){
        // Esto se remplaza
        // let form =  new formidable.IncomingForm()
        
        let form = formidable()

        form
            .parse(req, function(err, fields, files){

                res.writeHead(200, {'Content-Type' : 'text/html'})
                res.write(`
                    <h3>se ha enviado el archivo</h3>
                    <a href="/">Regresar</a>
                    <br>
                    <code> ${util.inspect({files : files})}</code>
                `)
                res.end()
            })
            .on('progress', function(bytesReceived, bytesExpected){
                let percentComplete = ( bytesReceived / bytesExpected ) * 100
                console.log(percentComplete.toFixed(3))
            })
            .on('error', function(err){
                console.log(err)
            })

            // TODO ESTO SE REMPLAZA 

            // .on('end', function(fields, files){
            //     let tempPath = this.openedFiles[0].path
            //     let fileName = this.openedFiles[0].name
            //     let newLocation = 'upload' + fileName

            //     fse.copy(tempPath, newLocation, function(err){
            //         return (err) ? console.log(err) : console.log('El archivo se ha subido con exito')
            //     })
            // })

            .on('file', (formName,file) => {
                
                fse.copyFile(file.filepath, 'upload/' + file.originalFilename, function(err) {

                    return err ? console.log(err) : console.log('Archivo subido con éxito.');
                })
            })

        return

    }
}

http.listen(3000)

console.log('servidor corriendo en http://localhost:3000/')