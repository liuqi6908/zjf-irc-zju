import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';

import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import { validatePath } from '@catsjuice/utils';

/**
 * 注册
 */
export default async function registerSwagger(
  app: INestApplication,
  cfgSrv: ConfigService,
  globalPrefix: string,
  version: string,
) {
  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setVersion(version)
    .setTitle(cfgSrv.get('SWAGGER_TITLE'))
    .setDescription(cfgSrv.get('SWAGGER_DESC'))
    .addServer('/')
    .addServer(cfgSrv.get('SWAGGER_SERVER_HOST'))
    .build();
  const cssUrl = validatePath(globalPrefix + '/assets/swagger.css');
  const jsRaw = validatePath(globalPrefix + '/assets/swagger.js');
  // const faviconUrl = validatePath(globalPrefix + '/assets/swagger-favicon.ico');
  const opt: SwaggerCustomOptions = {
    swaggerOptions: {
      filter: true,
      // useUnsafeMarkdown: true,
      persistAuthorization: true,
      showCommonExtensions: true,
      displayRequestDuration: true,
      syntaxHighlight: { activate: true, theme: 'arta' },
      defaultModelsExpandDepth: -1,
      tagsSorter: 'alpha',
    },
    customCssUrl: cssUrl,
    customJs: jsRaw,
    // customfavIcon: faviconUrl,
    useGlobalPrefix: true,
    customSiteTitle: cfgSrv.get('SWAGGER_TITLE'),
  };
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(cfgSrv.get('SWAGGER_PATH'), app, document, opt);
}
