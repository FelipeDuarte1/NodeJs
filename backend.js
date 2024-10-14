const express = require ('express') 
const cors = require ('cors')
const mongoose = require ('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt') 
const app = express() 
app.use(express.json())
app.use(cors())
//GET http://localhost:3000/hey 


const Filme = mongoose.model ("Filme", mongoose.Schema({
    titulo: {type: String}, 
    sinopse: {type: String}
    }))

const usuarioSchema = mongoose.Schema({
    login: {type: String, required: true, unique: true}, 
    password: {type: String, required: true}
    }) 
    usuarioSchema.plugin(uniqueValidator) 
    const Usuario = mongoose.model("Usuario", usuarioSchema)
        
async function conectarAoMongoDB() {
    await mongoose.connect(`mongodb+srv://felipeduarteabc:WXoAiBrlPayO9Qw3@cluster0.vpmed.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`) } 
        
    
app.listen(3000, () => {
    try{
    conectarAoMongoDB()
    console.log("up and running")
    } catch (e){
    console.log('Erro', e)
    }})    

app.get('/hey', (req, res) => {
    res.send('hey')
})

//GET http://localhost:3000/filmes
app.get("/filmes", async  (req, res) => {
    const filmes = await Filme.find()
    res.json(filmes)
})

//POST http://localhost:3000/filmes
app.post("/filmes", async (req, res) => {
    //obtém os dados enviados pelo cliente
    const titulo = req.body.titulo
    const sinopse = req.body.sinopse
    //monta um objeto agrupando os dados. Ele representa um novo filme
    const filme = new Filme({titulo: titulo, sinopse: sinopse}) 
    //adiciona o novo filme à base
    await filme.save()
    const filmes = await Filme.find()
    //responde ao cliente. Aqui, optamos por devolver a base inteira ao cliente, embora não seja obrigatório.
    res.json(filmes)
})

app.post('/signup', async (req, res) => {
    const login = req.body.login
    const password = req.body.password
    const usuario = new Usuario({
        login : login,
        password: password
    })
    const respMongo = await usuario.save()
    console.log(respMongo)
    res.end()
})