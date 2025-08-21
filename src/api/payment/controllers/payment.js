// // src/api/payment/controllers/payment.js
// const FlowApi = require('flowcl-node-api-client');

// module.exports = {
//   async createFlowPayment(ctx) {
//     try {
//       console.log('=== INICIO createFlowPayment ===');
//       const { amount, subject, items } = ctx.request.body;

//       console.log('Datos recibidos:', { amount, subject, items });

//       // DEBUG: Ver si las variables de entorno están cargando
//       console.log('FLOW_API_KEY:', process.env.FLOW_API_KEY ? 'Existe' : 'NO EXISTE');
//       console.log('FLOW_SECRET_KEY:', process.env.FLOW_SECRET_KEY ? 'Existe' : 'NO EXISTE');
//       console.log('NODE_ENV:', process.env.NODE_ENV);

//       // Configuración de Flow (usar variables de entorno)
//       const config = {
//         apiKey: process.env.FLOW_API_KEY,
//         secretKey: process.env.FLOW_SECRET_KEY,
//         apiURL: process.env.NODE_ENV !== 'production' 
//           ? "https://sandbox.flow.cl/api" 
//           : "https://www.flow.cl/api",
//         baseURL: process.env.BACKEND_URL
//       };

//       console.log('Config para Flow:', {
//         apiKey: config.apiKey ? 'Existe' : 'NO EXISTE',
//         secretKey: config.secretKey ? 'Existe' : 'NO EXISTE',
//         apiURL: config.apiURL,
//         baseURL: config.baseURL
//       });

//       // Genera un comerceOrder único (solo números y letras)
//       const comerceOrder = `ORDER${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
//       // URL de retorno después del pago
//       const urlReturn = `${process.env.FRONTEND_URL}/payment/success`;
//       // Para desarrollo local, podemos omitir urlConfirmation o usar una URL pública
//       // const urlConfirmation = `${process.env.BACKEND_URL}/api/payment/confirm-flow-payment`;

//       // Crear la orden de pago en Flow
//       const paymentData = {
//         commerceOrder: comerceOrder,
//         subject: subject || 'Compra en Aromas de Café',
//         currency: 'CLP',
//         amount: Math.max(Math.round(amount), 100), // Mínimo $100 CLP
//         email: ctx.request.body.email || 'lucascidcanetegames@gmail.com', // Usar un email más realista
//         paymentMethod: 9, // 9 = Todos los medios de pago
//         urlReturn: urlReturn
//         // Comentamos urlConfirmation para testing local
//         // urlConfirmation: urlConfirmation,
//       };

//       // Instanciar FlowApi y crear el pago
//       // @ts-ignore
//       const flowApi = new FlowApi(config);
//       const payment = await flowApi.send('payment/create', paymentData, 'POST');

//       if (payment && payment.url && payment.token) {
//         // Guardar la orden en la base de datos para posterior confirmación
//         await strapi.entityService.create('api::order.order', {
//           data: {
//             comerceOrder: comerceOrder,
//             amount: amount,
//             status: 'pending',
//             items: JSON.stringify(items),
//             flowToken: payment.token,
//             email: ctx.request.body.email || 'lucascidcanetegames@gmail.com'
//           }
//         });

//         ctx.body = {
//           success: true,
//           paymentUrl: payment.url,
//           token: payment.token,
//           comerceOrder: comerceOrder
//         };
//       } else {
//         ctx.body = {
//           success: false,
//           message: 'Error al crear el pago en Flow'
//         };
//       }

//     } catch (error) {
//       console.error('Error creando pago Flow:', error);
//       ctx.body = {
//         success: false,
//         message: 'Error interno del servidor: ' + error.message
//       };
//     }
//   },

//   async confirmFlowPayment(ctx) {
//     try {
//       const { token } = ctx.request.body;

//       const config = {
//         apiKey: process.env.FLOW_API_KEY,
//         secretKey: process.env.FLOW_SECRET_KEY,
//         apiURL: process.env.NODE_ENV !== 'production' 
//           ? "https://sandbox.flow.cl/api" 
//           : "https://www.flow.cl/api",
//         baseURL: process.env.BACKEND_URL
//       };

//       // Instanciar FlowApi
//       // @ts-ignore
//       const flowApi = new FlowApi(config);

//       // Obtener el estado del pago desde Flow
//       const paymentStatus = await flowApi.send('payment/getStatus', { token }, 'GET');

//       if (paymentStatus && paymentStatus.status === 2) { // 2 = Pagado
//         // Actualizar el estado de la orden en la base de datos
//         const orders = await strapi.entityService.findMany('api::order.order', {
//           filters: { flowToken: token }
//         });

//         if (orders.length > 0) {
//           const order = orders[0];
//           await strapi.entityService.update('api::order.order', order.id, {
//             data: {
//               status: 'completed',
//               paidAt: new Date()
//             }
//           });

//           ctx.body = {
//             success: true,
//             message: 'Pago confirmado exitosamente'
//           };
//         } else {
//           ctx.body = {
//             success: false,
//             message: 'Orden no encontrada'
//           };
//         }
//       } else {
//         ctx.body = {
//           success: false,
//           message: 'Pago no confirmado'
//         };
//       }

//     } catch (error) {
//       console.error('Error confirmando pago:', error);
//       ctx.body = {
//         success: false,
//         message: 'Error al confirmar el pago: ' + error.message
//       };
//     }
//   }
// };

// src/api/payment/controllers/payment.js
const FlowApi = require('flowcl-node-api-client');

module.exports = {
  async createFlowPayment(ctx) {
    try {
      console.log('=== INICIO createFlowPayment ===');
      const { amount, subject, items } = ctx.request.body;

      console.log('Datos recibidos:', { amount, subject, items });

      // DEBUG: Ver si las variables de entorno están cargando
      console.log('FLOW_API_KEY:', process.env.FLOW_API_KEY ? 'Existe' : 'NO EXISTE');
      console.log('FLOW_SECRET_KEY:', process.env.FLOW_SECRET_KEY ? 'Existe' : 'NO EXISTE');
      console.log('NODE_ENV:', process.env.NODE_ENV);

      // Configuración de Flow (usar variables de entorno)
      const config = {
        apiKey: process.env.FLOW_API_KEY,
        secretKey: process.env.FLOW_SECRET_KEY,
        apiURL: process.env.NODE_ENV !== 'production' 
          ? "https://sandbox.flow.cl/api" 
          : "https://www.flow.cl/api",
        baseURL: process.env.BACKEND_URL
      };

      console.log('Config para Flow:', {
        apiKey: config.apiKey ? 'Existe' : 'NO EXISTE',
        secretKey: config.secretKey ? 'Existe' : 'NO EXISTE',
        apiURL: config.apiURL,
        baseURL: config.baseURL
      });

      // Genera un comerceOrder único (solo números y letras)
      const comerceOrder = `ORDER${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      // URL de retorno después del pago
      const urlReturn = `${process.env.FRONTEND_URL}/payment/success`;
      // Para desarrollo local, usar una URL ficticia válida
      const urlConfirmation = `https://httpbin.org/post`; // URL de prueba que acepta POST

      // Crear la orden de pago en Flow
      const paymentData = {
        commerceOrder: comerceOrder,
        subject: subject || 'Compra en Aromas de Café',
        currency: 'CLP',
        amount: Math.max(Math.round(amount), 100), // Mínimo $100 CLP
        email: ctx.request.body.email || 'lucascidcanetegames@gmail.com', // Usar un email más realista
        paymentMethod: 9, // 9 = Todos los medios de pago
        urlReturn: urlReturn,
        urlConfirmation: urlConfirmation
        // Comentamos urlConfirmation para testing local
        // urlConfirmation: urlConfirmation,
      };

      // Instanciar FlowApi y crear el pago
      // @ts-ignore
      const flowApi = new FlowApi(config);
      const payment = await flowApi.send('payment/create', paymentData, 'POST');

      if (payment && payment.url && payment.token) {
        // Guardar la orden en la base de datos para posterior confirmación
        await strapi.entityService.create('api::order.order', {
          data: {
            comerceOrder: comerceOrder,
            amount: amount,
            status: 'pending',
            items: JSON.stringify(items),
            flowToken: payment.token,
            email: ctx.request.body.email || 'lucascidcanetegames@gmail.com'
          }
        });

        ctx.body = {
          success: true,
          paymentUrl: payment.url,
          token: payment.token,
          comerceOrder: comerceOrder
        };
      } else {
        ctx.body = {
          success: false,
          message: 'Error al crear el pago en Flow'
        };
      }

    } catch (error) {
      console.error('Error creando pago Flow:', error);
      ctx.body = {
        success: false,
        message: 'Error interno del servidor: ' + error.message
      };
    }
  },

  async confirmFlowPayment(ctx) {
    try {
      const { token } = ctx.request.body;

      const config = {
        apiKey: process.env.FLOW_API_KEY,
        secretKey: process.env.FLOW_SECRET_KEY,
        apiURL: process.env.NODE_ENV !== 'production' 
          ? "https://sandbox.flow.cl/api" 
          : "https://www.flow.cl/api",
        baseURL: process.env.BACKEND_URL
      };

      // Instanciar FlowApi
      // @ts-ignore
      const flowApi = new FlowApi(config);

      // Obtener el estado del pago desde Flow
      const paymentStatus = await flowApi.send('payment/getStatus', { token }, 'GET');

      if (paymentStatus && paymentStatus.status === 2) { // 2 = Pagado
        // Actualizar el estado de la orden en la base de datos
        const orders = await strapi.entityService.findMany('api::order.order', {
          filters: { flowToken: token }
        });

        if (orders.length > 0) {
          const order = orders[0];
          await strapi.entityService.update('api::order.order', order.id, {
            data: {
              status: 'completed',
              paidAt: new Date()
            }
          });

          ctx.body = {
            success: true,
            message: 'Pago confirmado exitosamente'
          };
        } else {
          ctx.body = {
            success: false,
            message: 'Orden no encontrada'
          };
        }
      } else {
        ctx.body = {
          success: false,
          message: 'Pago no confirmado'
        };
      }

    } catch (error) {
      console.error('Error confirmando pago:', error);
      ctx.body = {
        success: false,
        message: 'Error al confirmar el pago: ' + error.message
      };
    }
  }
};