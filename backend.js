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
    try{
    const login = req.body.login
    const password = req.body.password
    const criptografada = await bcrypt.hash(password, 10)
    const usuario = new Usuario({ 
        login: login, 
        password: criptografada
    })
    const respMongo = await usuario.save()
    console.log(respMongo)
    res.status(201).end()}
    catch(error){
        console.log(error) 
        res.status(409).end()
    }
})

app.post('/login', async (req, res) => { 
    //login/senha que o usuário enviou 
    const login = req.body.login 
    const password = req.body.password
    //tentamos encontrar no MongoDB
    const u = await Usuario.findOne({login: req.body.login}) 
    if(!u){
        //senão foi encontrado, encerra por aqui com código 401
        return res.status(401).json({mensagem: "login inválido"})}
        //se foi encontrado, comparamos a senha, após descriptográ-la
    const senhaValida = await bcrypt.compare(password, u.password) 
    if (!senhaValida){
        return res.status(401).json({mensagem: "senha inválida"})
            //deixa assim por enquanto, já já arrumamos 
        res.end()
}})


