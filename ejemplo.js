import express from 'express';
import moment from 'moment';
import fs from 'fs';

class Archivo {
    constructor ( nombreArchivo ) {
        this.nombre = nombreArchivo
    }
        leer = async () => {
            try {
                const data =  fs.readFileSync(this.nombre, 'utf-8');
                // console.log(JSON.parse(data));
                return JSON.parse(data)
            } catch (e) {
                console.log('Este array está vacío...');
                return []
              }
        }
}

const app = express();
const PORT = 8080;
let visitas1 = 0;
let visitas2 = 0;

const server = app.listen(PORT, ()=>{
    console.log('Servidor HTTP escuchando en el puerto', server.address().port);
});
server.on('error', error=>console.log('Error en servidor', error));

app.get('/items', (req,res)=>{
    ++visitas1
    console.log('request a get items recibido!');
    const archivo = new Archivo('./productos.txt');
    archivo.leer().then(productos => {
            const objRes = {
            item: productos,
            cantidad: productos.length
        };
        res.json(objRes);
    })
});

app.get('/item-random', (req,res) => {
    ++visitas2
    console.log('request a get item-random recibido!');
    const archivo = new Archivo('./productos.txt');
    archivo.leer().then(productos => {
        let producto = productos[Math.floor(Math.random() * productos.length)]
        const objRes = {
            item: producto
        };
        res.json(objRes);
    })
});

app.get('/visitas', (req,res)=>{
    console.log('request a get visitas recibido!');
    const objRes = {
        visitas: {
            items: visitas1,
            item_random: visitas2
        }
    };
    res.send(objRes);
});

