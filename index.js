const express = require('express')
const agentes = require('./data/agentes.js').results
const app = express()
const jwt = require('jsonwebtoken')
const cors = require('cors');

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Your app listening on port 3000'))

const secretKey = 'Shhhhh'
app.use(cors());

function generateToken(email) {
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 120,
      email,
    },
    secretKey
  )
}

// app.get("/" , (req,res) => {
//   res.sendFile(__dirname + "/index.html")
// })

app.get('/SignIn', (req, res) => {
  let email = req.query.email
  let pass = req.query.password
  let agent = agentes.find((u) => u.email == email && u.password == pass)
  console.log(email)
  let token = generateToken(email)
  agent
    ? res.send(`
    <p> Agente autenticado, bienvenido <b>${email}</b>
    Su token está en el sessionStorage </p>
    <a href="/Dashboard?token=${token}"> Ir al Dashboard</a>
    <script>
      sessionStorage.setItem('token', JSON.stringify("${token}"))
    </script>
    `)
    : res.send('Usuario o contraseña incorrecta')
})

app.get('/Dashboard', (req, res) => {
  let token = req.query.token
  jwt.verify(token, secretKey, function (err, decoded) {
    err
      ? res.status(401).send(`Usted no está autorizado para entrar al Dashboard, error => ${err.message}`)
      : res.send(`
      Bienvenido al Dashboard ${decoded.email}
    `)
  })
})


// http://localhost:3000/SignIn?email=how@fbi.com&password=exactly