import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
// Swagger Options
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API',
            description: "API endpoints for a mini blog services documented on swagger",
            contact: {
                name: "VIPACK",
                email: "vanhhh59@gmail.com",
                url: "https://github.com/vanhh59/vpack-ecomerce.git"
            },
            version: '1.0.0',
        },
        servers: [
            {
                url: "http://localhost:10000/",
                description: "Local server"
            },
            {
                url: "https://vpack-ecomerce.onrender.com/",
                description: "Live server"
            },
        ]
    },
    // looks for configuration in specified directories
    // đây là nơi chứa các file route cần được tạo swagger docs
    apis: ['./backend/routes/*.js'],
}
const swaggerSpec = swaggerJsdoc(options)
function swaggerDocs(app, port) {
    // Swagger Page
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    // Documentation in JSON format
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })
}
export default swaggerDocs