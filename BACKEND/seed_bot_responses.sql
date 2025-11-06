-- Seed common bot responses for e-commerce FAQ
-- Columns: clave, respuesta, prioridad, enabled

INSERT INTO bot_responses (clave, respuesta, prioridad, enabled) VALUES
('horario','Nuestro horario es Lunes a Viernes 8:00-18:00 y Sábados 9:00-13:00', 10, true),
('envio','Los envíos tardan 2-5 días hábiles dependiendo de tu ubicación. Te enviaremos un código de seguimiento cuando despachemos tu pedido.', 10, true),
('devolucion','Aceptamos devoluciones dentro de 15 días desde la entrega, con el producto en su estado original y la factura. Consulta las condiciones específicas en nuestra política de devoluciones.', 9, true),
('pedido_estado','Puedes ver el estado de tus pedidos en la sección "Mis pedidos" dentro de tu cuenta. Si necesitas ayuda con un pedido específico, dime el número de pedido.', 9, true),
('cambiar_contraseña','Para cambiar tu contraseña ve a Perfil > Configuración > Cambiar contraseña. Si olvidaste tu contraseña utiliza el enlace "Recuperar contraseña" en la pantalla de inicio de sesión.', 10, true),
('cambiar_nombre','Puedes editar tu nombre desde Perfil > Editar perfil. Después de guardar, los cambios se reflejarán en tu cuenta.', 8, true),
('metodos_pago','Aceptamos tarjetas de crédito, débito, y pagos por transferencia. También soportamos pagos por PSE/ACH y pagos en efectivo en puntos habilitados según país.', 8, true),
('seguimiento','Una vez procesado el pedido te enviaremos un correo con el número de seguimiento y un enlace para verificar el estado de entrega.', 9, true),
('garantia','Todos nuestros productos cuentan con garantía del fabricante; revisa la ficha del producto para ver la duración exacta y condiciones. Podemos ayudarte a gestionar la garantía si lo necesitas.', 7, true),
('promociones','Las promociones y descuentos se anuncian en la página principal y en nuestras redes sociales. Consulta la sección "Ofertas" para ver promociones activas.', 6, true),
('cancelar_pedido','Si deseas cancelar un pedido contáctanos cuanto antes con el número de pedido. Si aún no ha sido despachado podremos cancelar y reembolsar según tu método de pago.', 9, true),
('devolucion_tiempo','Los reembolsos suelen demorarse 5-10 días hábiles dependiendo del banco y método de pago.', 7, true),
('factura','Si necesitas factura fiscal, solicita la emisión proporcionando tus datos fiscales en el formulario de pedido o contacta soporte.', 6, true),
('tallas','Consulta la guía de tallas en la página del producto. Si tienes dudas sobre medidas, dinos qué prenda te interesa y te ayudamos.', 6, true),
('stock','Si un producto aparece como agotado puedes suscribirte para recibir notificación cuando vuelva a estar disponible.', 6, true),
('devolucion_danos','Si recibiste el producto dañado, por favor sube fotos y contacto en el formulario de devoluciones para gestionar un reemplazo o reembolso.', 9, true),
('recoger_tienda','Ofrecemos recogida en tienda en puntos seleccionados; durante el checkout podrás elegir la opción si está disponible para tu zona.', 6, true),
('facturacion','Para consultas de facturación escríbenos indicando tu número de pedido y los datos requeridos y te ayudamos a gestionarlo.', 6, true),
('soporte','Puedes hablar con soporte a través de WhatsApp, correo o el chat en vivo. ¿Quieres que te conecte por WhatsApp?', 10, true),
('ventas_mayor','Para compras al por mayor o cotizaciones escríbenos indicando los productos y cantidades y nuestro equipo de ventas te contactará.', 8, true),
('cupon','Si tienes un cupón, introdúcelo en la pantalla de pago antes de finalizar la compra. Consulta las condiciones del cupón (vigencia y productos aplicables).', 7, true),
('devolucion_sin_factura','En algunos casos aceptamos devoluciones sin factura presentando otra prueba de compra. Contacta soporte con tu número de pedido para evaluar el caso.', 5, true),
('resenas','Puedes dejar una reseña en la página del producto después de recibir tu pedido. Las reseñas ayudan a otros clientes.', 4, true),
('reserva','Si quieres reservar un producto contáctanos para verificar disponibilidad y condiciones de reserva.', 4, true),
('ayuda_pago','Si tu pago falló, intenta nuevamente o contáctanos indicando el código de error y el monto; verificaremos el estado del pago.', 9, true),
('devolucion_cambio','Si quieres cambiar por otra talla o color, solicita la gestión desde la sección de devoluciones y te indicaremos el proceso y costos si aplica.', 8, true),
('cuenta_bloqueada','Si tu cuenta fue bloqueada por seguridad, contacta soporte indicando tu usuario para que verifiquemos e restauremos el acceso.', 9, true),
('registro','Para registrarte necesitas un correo electrónico válido y crear una contraseña. También puedes registrarte con Google/Facebook si está habilitado.', 6, true),
('factura_electronica','Solicita factura electrónica indicando tus datos fiscales al momento de la compra o por correo dentro de los 7 días siguientes.', 5, true),
('devolucion_plazo','Recuerda: el plazo de devoluciones corre desde la fecha de entrega al cliente, no desde la fecha de envío.', 6, true),
('contacto','Nuestro correo de atención es soporte@ejemplo.com y también atendemos por WhatsApp y teléfono en horario laboral.', 6, true),
('tarjetas','Aceptamos Visa, Mastercard y American Express según país.', 6, true);

-- Saludos y despedidas
INSERT INTO bot_responses (clave, respuesta, prioridad, enabled) VALUES
('saludo','¡Hola! Bienvenido a nuestra tienda. Puedo ayudarte con pedidos, envíos, devoluciones, o conectarte con soporte por WhatsApp si lo prefieres.', 10, true),
('despedida','Gracias por visitarnos. Si necesitas algo más, vuelve cuando quieras. ¡Que tengas un excelente día!', 4, true),
('request_whatsapp','Puedo conectarte por WhatsApp con nuestro equipo de soporte. ¿Deseas que te transfiera ahora?', 10, true),
('stock_tarjetas','Si tienes problemas con el stock: si un producto aparece como agotado puedes suscribirte para recibir notificación cuando vuelva a estar disponible. Sobre tarjetas: aceptamos Visa, Mastercard y American Express; si tu pago con tarjeta falla, intenta otra tarjeta o contáctanos indicando el error para que lo revisemos.', 9, true);

-- Puedes añadir más filas siguiendo el mismo patrón.
