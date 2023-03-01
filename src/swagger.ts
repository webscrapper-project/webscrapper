import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

export const swagger = (app)=>{
    const options = new DocumentBuilder()
        .setTitle(' WebScrapper')
        .setVersion('1.0')
        // .addBearerAuth({
        //     type: 'http',
        //     description: 'Token can be obtained from the /users/login endpoint',
        // })
        // .addApiKey(
        //     {
        //         type: 'apiKey',
        //         name: 'X-API-KEY',
        //         in: 'header',
        //         description: 'API Key for endpoints without login requirements',
        //     },
        //     'api_key',
        // )
        // .addApiKey(
        //     {
        //         type: 'apiKey',
        //         name: 'api_key',
        //         in: 'query',
        //         description: 'API Key for health endpoints',
        //     },
        //     'health_api_key',
        // )
        .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('swagger-api', app, document);

}
