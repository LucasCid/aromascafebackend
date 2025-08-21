  // backend-ecommerce/src/api/payment/routes/payment.js
  module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/payment/create-flow-payment',
        handler: 'payment.createFlowPayment',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/payment/confirm-flow-payment',
        handler: 'payment.confirmFlowPayment',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };