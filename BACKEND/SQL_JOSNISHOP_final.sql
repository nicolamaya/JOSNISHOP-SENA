-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               11.8.2-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for josnishop
DROP DATABASE IF EXISTS `josnishop`;
CREATE DATABASE IF NOT EXISTS `josnishop` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `josnishop`;

-- Dumping structure for table josnishop.alembic_version

CREATE TABLE IF NOT EXISTS `roles` (
  `id_rol` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;


CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `contraseña` varchar(255) DEFAULT NULL,
  `rol_id` int(11) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  KEY `rol_id` (`rol_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;


CREATE TABLE IF NOT EXISTS `categorias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `fecha_creacion` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;


CREATE TABLE IF NOT EXISTS `productos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) DEFAULT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `categoria_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `categoria_id` (`categoria_id`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;


CREATE TABLE IF NOT EXISTS `inventarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `producto_id` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `stock_minimo` int(11) DEFAULT NULL,
  `fecha_actualizacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `inventarios_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;


CREATE TABLE IF NOT EXISTS `item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `serial` varchar(60) DEFAULT NULL,
  `fecha_ingreso` date DEFAULT NULL,
  `fecha_salida` date DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `precio` float DEFAULT NULL,
  `productos_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `productos_id` (`productos_id`),
  CONSTRAINT `item_ibfk_1` FOREIGN KEY (`productos_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;


CREATE TABLE IF NOT EXISTS `videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `producto_id` int(11) DEFAULT NULL,
  `url` varchar(200) DEFAULT NULL,
  `fecha_subida` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `videos_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

CREATE TABLE IF NOT EXISTS `reseñas` (
  `id_reseña` int(11) NOT NULL AUTO_INCREMENT,
  `producto_id` int(11) DEFAULT NULL,
  `cliente_id` int(11) DEFAULT NULL,
  `calificación` int(11) DEFAULT NULL,
  `comentario` text DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  PRIMARY KEY (`id_reseña`),
  KEY `cliente_id` (`cliente_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `reseñas_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `reseñas_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

CREATE TABLE IF NOT EXISTS `notificaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `mensaje` text DEFAULT NULL,
  `fecha_envio` datetime DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

CREATE TABLE IF NOT EXISTS `pedidos` (
  `id_pedido` int(11) NOT NULL AUTO_INCREMENT,
  `cliente_id` int(11) DEFAULT NULL,
  `fecha_pedido` datetime DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `total` float DEFAULT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `cliente_id` (`cliente_id`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;


CREATE TABLE IF NOT EXISTS `detalle_pedido` (
  `id_detalle` int(11) NOT NULL AUTO_INCREMENT,
  `pedido_id` int(11) DEFAULT NULL,
  `producto_id` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `subtotal` float DEFAULT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `pedido_id` (`pedido_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `detalle_pedido_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id_pedido`),
  CONSTRAINT `detalle_pedido_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;


CREATE TABLE IF NOT EXISTS `chat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_origen` int(11) DEFAULT NULL,
  `usuario_destino` int(11) DEFAULT NULL,
  `mensaje` text DEFAULT NULL,
  `fecha_envio` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_destino` (`usuario_destino`),
  KEY `usuario_origen` (`usuario_origen`),
  CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`usuario_destino`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `chat_ibfk_2` FOREIGN KEY (`usuario_origen`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;


-- ===================
-- INSERTS AL FINAL
-- ===================

INSERT INTO `roles` (`id_rol`, `nombre`, `estado`) VALUES
	(1, 'vendedor', 1),
	(2, 'cliente', 1);

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `correo`, `contraseña`, `rol_id`, `estado`) VALUES
	(1, 'Josthin Paz', 'josthinpaz2@gmail.com', 'Josthin_10', 1, 1),
	(2, 'María Gómez', 'Cherith1605@gmail.com', '123', 2, 1),
	(3, 'Carlos Ruiz', 'carlos.ruiz@mail.com', 'cliente123', 2, 1),
	(4, 'Laura Sánchez', 'laura.sanchez@mail.com', 'cliente123', 2, 1),
	(5, 'Andrés Torres', 'andres.torres@mail.com', 'cliente123', 2, 1),
	(6, 'Sofía Ramírez', 'sofia.ramirez@mail.com', 'cliente123', 2, 1),
	(7, 'Pedro Castillo', 'pedro.castillo@mail.com', 'cliente123', 2, 1),
	(8, 'Lucía Fernández', 'lucia.fernandez@mail.com', 'cliente123', 2, 1),
	(9, 'Jorge Herrera', 'jorge.herrera@mail.com', 'cliente123', 2, 1),
	(10, 'Valentina Rojas', 'valentina.rojas@mail.com', 'cliente123', 2, 1),
	(11, 'Felipe Morales', 'felipe.morales@mail.com', 'cliente123', 2, 1),
	(12, 'Camila Vargas', 'camila.vargas@mail.com', 'cliente123', 2, 1),
	(13, 'Ricardo López', 'ricardo.lopez@mail.com', 'cliente123', 2, 1),
	(14, 'Daniela Castro', 'daniela.castro@mail.com', 'cliente123', 2, 1),
	(15, 'Mateo Gil', 'mateo.gil@mail.com', 'cliente123', 2, 1),
	(16, 'Gabriela Salazar', 'gabriela.salazar@mail.com', 'cliente123', 2, 1),
	(17, 'David Torres', 'david.torres@mail.com', 'cliente123', 2, 1),
	(18, 'Paula Díaz', 'paula.diaz@mail.com', 'cliente123', 2, 1),
	(19, 'Sebastián Romero', 'sebastian.romero@mail.com', 'cliente123', 2, 1),
	(20, 'Mónica Jiménez', 'monica.jimenez@mail.com', 'cliente123', 2, 1),
	(21, 'Álvaro Medina', 'alvaro.medina@mail.com', 'cliente123', 2, 1),
	(22, 'Natalia Figueroa', 'natalia.figueroa@mail.com', 'cliente123', 2, 1),
	(23, 'Cristian Cárdenas', 'cristian.cardenas@mail.com', 'cliente123', 2, 1),
	(24, 'Diana Ortega', 'diana.ortega@mail.com', 'cliente123', 2, 1),
	(25, 'Oscar Pineda', 'oscar.pineda@mail.com', 'cliente123', 2, 1),
	(26, 'Karina Suárez', 'karina.suarez@mail.com', 'cliente123', 2, 1),
	(27, 'Fernando Molina', 'fernando.molina@mail.com', 'cliente123', 2, 1),
	(28, 'Lorena Mejía', 'lorena.mejia@mail.com', 'cliente123', 2, 1),
	(29, 'Iván Delgado', 'ivan.delgado@mail.com', 'cliente123', 2, 1),
	(30, 'Alejandra Nieto', 'alejandra.nieto@mail.com', 'cliente123', 2, 1),
	(31, 'Héctor Silva', 'hector.silva@mail.com', 'cliente123', 2, 1),
	(32, 'Carolina Lozano', 'carolina.lozano@mail.com', 'cliente123', 2, 1),
	(33, 'Mauricio Peña', 'mauricio.pena@mail.com', 'cliente123', 2, 1),
	(34, 'Juliana Arias', 'juliana.arias@mail.com', 'cliente123', 2, 1),
	(35, 'Esteban Cabrera', 'esteban.cabrera@mail.com', 'cliente123', 2, 1),
	(36, 'Tatiana Muñoz', 'tatiana.munoz@mail.com', 'cliente123', 2, 1),
	(37, 'Francisco Vega', 'francisco.vega@mail.com', 'cliente123', 2, 1),
	(38, 'Angela Páez', 'angela.paez@mail.com', 'cliente123', 2, 1),
	(39, 'Diego Villalba', 'diego.villalba@mail.com', 'cliente123', 2, 1),
	(40, 'Marcela Cifuentes', 'marcela.cifuentes@mail.com', 'cliente123', 2, 1),
	(41, 'Camilo Rincón', 'camilo.rincon@mail.com', 'cliente123', 2, 1),
	(42, 'Liliana Pardo', 'liliana.pardo@mail.com', 'cliente123', 2, 1),
	(43, 'Raúl Montoya', 'raul.montoya@mail.com', 'cliente123', 2, 1),
	(44, 'Pilar León', 'pilar.leon@mail.com', 'cliente123', 2, 1),
	(45, 'Andrés Beltrán', 'andres.beltran@mail.com', 'cliente123', 2, 1),
	(46, 'Margarita Correa', 'margarita.correa@mail.com', 'cliente123', 2, 1),
	(47, 'Hernán Duarte', 'hernan.duarte@mail.com', 'cliente123', 2, 1),
	(48, 'Verónica Ríos', 'veronica.rios@mail.com', 'cliente123', 2, 1),
	(49, 'Guillermo Vargas', 'guillermo.vargas@mail.com', 'cliente123', 2, 1),
	(50, 'Isabel Castillo', 'isabel.castillo@mail.com', 'cliente123', 2, 1),
	(51, 'juan', 'juan@gmail.com', '123', 1, NULL);

INSERT INTO `categorias` (`id`, `nombre`, `estado`, `fecha_creacion`) VALUES
	(1, 'Electrónicos', 1, '2025-01-05'),
	(2, 'Celulares y Accesorios', 1, '2025-01-05'),
	(3, 'Computadores y Laptops', 1, '2025-01-06'),
	(4, 'Tablets', 1, '2025-01-06'),
	(5, 'Audio y Video', 1, '2025-01-07'),
	(6, 'Televisores', 0, '2025-01-07'),
	(7, 'Electrodomésticos', 1, '2025-01-08'),
	(8, 'Cocina', 1, '2025-01-08'),
	(9, 'Hogar y Decoración', 0, '2025-01-09'),
	(10, 'Muebles', 1, '2025-01-09'),
	(11, 'Dormitorio', 1, '2025-01-10'),
	(12, 'Baño', 0, '2025-01-10'),
	(13, 'Ropa Hombre', 1, '2025-01-11'),
	(14, 'Ropa Mujer', 1, '2025-01-11'),
	(15, 'Ropa Infantil', 0, '2025-01-12'),
	(16, 'Calzado', 1, '2025-01-12'),
	(17, 'Accesorios de Moda', 1, '2025-01-13'),
	(18, 'Juguetes', 1, '2025-01-13'),
	(19, 'Bebés', 0, '2025-01-14'),
	(20, 'Deportes', 1, '2025-01-14'),
	(21, 'Ciclismo', 1, '2025-01-15'),
	(22, 'Fitness', 0, '2025-01-15'),
	(23, 'Herramientas', 1, '2025-01-16'),
	(24, 'Automotriz', 1, '2025-01-16'),
	(25, 'Mascotas', 0, '2025-01-17'),
	(26, 'Librería y Papelería', 1, '2025-01-17'),
	(27, 'Arte y Manualidades', 1, '2025-01-18'),
	(28, 'Belleza y Cuidado Personal', 1, '2025-01-18'),
	(29, 'Salud', 0, '2025-01-19'),
	(30, 'Jardinería', 1, '2025-01-19');

INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `categoria_id`) VALUES
	(1, 'Smartwatch X200', 'Reloj inteligente con monitoreo de salud y notificaciones', 1),
	(2, 'Cámara Digital ProShot', 'Cámara de 24MP con lente intercambiable', 1),
	(3, 'iPhone 15 Pro', 'Celular de última generación con chip A17', 2),
	(4, 'Samsung Galaxy S23', 'Smartphone con pantalla AMOLED 120Hz', 2),
	(5, 'Cargador Inalámbrico Qi', 'Base de carga rápida universal', 2),
	(6, 'Laptop ASUS ZenBook', 'Ultrabook con procesador Intel i7', 3),
	(7, 'MacBook Air M2', 'Laptop ligera con chip Apple Silicon', 3),
	(8, 'iPad Air', 'Pantalla de 10.9 pulgadas con Apple Pencil', 4),
	(9, 'Samsung Galaxy Tab S9', 'Tableta AMOLED con 8GB RAM', 4),
	(10, 'Audífonos Sony WH-1000XM5', 'Auriculares con cancelación de ruido', 5),
	(11, 'Parlante JBL Charge 5', 'Bocina portátil resistente al agua', 5),
	(12, 'TV LG OLED 55"', 'Pantalla 4K UHD con HDR10+', 6),
	(13, 'Samsung QLED 65"', 'Smart TV con Alexa integrado', 6),
	(14, 'Refrigerador LG', 'No Frost con dispensador de agua', 7),
	(15, 'Lavadora Samsung', 'Lavadora automática 18kg', 7),
	(16, 'Horno Microondas Panasonic', '1200W con 10 programas automáticos', 8),
	(17, 'Licuadora Oster Pro', 'Motor de alto rendimiento', 8),
	(18, 'Alfombra Moderna', 'Diseño geométrico de 2x3m', 9),
	(19, 'Lámpara de Pie LED', 'Iluminación regulable para sala', 9),
	(20, 'Sofá 3 Puestos', 'Tapizado en tela gris', 10),
	(21, 'Mesa de Comedor 6 Puestos', 'Madera maciza con acabado natural', 10),
	(22, 'Cama Queen', 'Estructura de madera con cabecero', 11),
	(23, 'Colchón Ortopédico', 'Colchón de espuma viscoelástica', 11),
	(24, 'Espejo con Luz LED', 'Espejo antivaho con iluminación integrada', 12),
	(25, 'Set de Toallas Premium', 'Algodón egipcio 6 piezas', 12),
	(26, 'Camiseta Polo', 'Camiseta 100% algodón color azul', 13),
	(27, 'Chaqueta de Cuero', 'Estilo biker en cuero genuino', 13),
	(28, 'Vestido de Verano', 'Vestido floral ligero', 14),
	(29, 'Blusa Elegante', 'Blusa satinada color beige', 14),
	(30, 'Conjunto Infantil', 'Camisa y pantalón para niño', 15),
	(31, 'Vestido Niña', 'Vestido rosa con estampado floral', 15),
	(32, 'Zapatillas Nike Air', 'Tenis deportivos edición limitada', 16),
	(33, 'Botines de Cuero', 'Botines casuales para mujer', 16),
	(34, 'Bolso de Mano', 'Bolso de cuero sintético', 17),
	(35, 'Reloj Casio', 'Clásico modelo retro digital', 17),
	(36, 'Lego Star Wars', 'Set de construcción edición especial', 18),
	(37, 'Muñeca Barbie', 'Barbie Dreamhouse', 18),
	(38, 'Coche de Bebé', 'Carriola ligera plegable', 19),
	(39, 'Silla para Comer', 'Silla de bebé ajustable', 19),
	(40, 'Balón de Fútbol Adidas', 'Balón oficial tamaño 5', 20),
	(41, 'Raqueta de Tenis Wilson', 'Raqueta profesional ligera', 20),
	(42, 'Bicicleta MTB', 'Bicicleta de montaña con suspensión doble', 21),
	(43, 'Casco Ciclismo Giro', 'Casco ultraligero con ventilación', 21),
	(44, 'Mancuernas Ajustables', 'Juego de pesas hasta 25kg', 22),
	(45, 'Colchoneta Yoga', 'Esterilla antideslizante', 22),
	(46, 'Taladro Bosch', 'Taladro inalámbrico 18V', 23),
	(47, 'Juego de Destornilladores', 'Set de 40 piezas', 23),
	(48, 'Aceite de Motor Castrol', 'Aceite sintético 5W30', 24),
	(49, 'Batería de Carro Bosch', '12V de larga duración', 24),
	(50, 'Comedero Automático', 'Dispensador de comida programable', 25),
	(51, 'Cama para Perro', 'Cama ortopédica tamaño grande', 25),
	(52, 'Cuaderno Profesional', 'Cuaderno de 200 hojas', 26),
	(53, 'Set de Marcadores', 'Marcadores permanentes de colores', 26),
	(54, 'Pinceles Profesionales', 'Set de 12 pinceles de pintura', 27),
	(55, 'Kit de Scrapbook', 'Accesorios para manualidades', 27),
	(56, 'Plancha de Cabello Remington', 'Cerámica con iones anti-frizz', 28),
	(57, 'Perfume Dior Sauvage', 'Fragancia masculina 100ml', 28),
	(58, 'Termómetro Digital', 'Termómetro infrarrojo sin contacto', 29),
	(59, 'Tensiómetro Omron', 'Medidor de presión arterial automático', 29),
	(60, 'Maceta de Cerámica', 'Maceta decorativa para interiores', 30),
	(61, 'Auriculares E6S', 'Auriculares deportivos bluetooth', 1),
	(62, 'Auriculares Pro', 'Auriculares profesionales', 1),
	(63, 'Bolso de hombro para mujer', 'Bolso elegante y resistente', 2),
	(64, 'Cafetera', 'Cafetera eléctrica moderna', 3),
	(65, 'Lienzo Bastidor 12 X 18 Cm', 'Lienzo en caballete de madera 280g/m2', 4),
	(66, 'Reloj inteligente', 'Reloj para monitorear actividad física', 5),
	(67, 'Set de cocina', 'Set completo para cocina', 3),
	(68, 'Sofá moderno', 'Sofá cómodo y elegante', 6),
	(69, 'Zapatillas deportivas', 'Zapatillas para correr', 7),
	(70, 'Consola de videojuegos', 'Consola última generación', 8),
	(71, 'Perro de peluche', 'Juguete suave para niños', 9),
	(72, 'Cocina eléctrica', 'Cocina de inducción', 3);

INSERT INTO `inventarios` (`id`, `producto_id`, `cantidad`, `stock_minimo`, `fecha_actualizacion`) VALUES
	(1, 1, 20, 20, '2025-08-01 00:00:00'),
	(2, 2, 118, 20, '2025-08-02 00:00:00'),
	(3, 3, 142, 20, '2025-08-03 00:00:00'),
	(4, 4, 127, 20, '2025-08-04 00:00:00'),
	(5, 5, 150, 20, '2025-08-05 00:00:00'),
	(6, 6, 160, 20, '2025-08-06 00:00:00'),
	(7, 7, 122, 20, '2025-08-07 00:00:00'),
	(8, 8, 130, 20, '2025-08-08 00:00:00'),
	(9, 9, 119, 20, '2025-08-09 00:00:00'),
	(10, 10, 140, 20, '2025-08-10 00:00:00'),
	(11, 11, 133, 20, '2025-08-11 00:00:00'),
	(12, 12, 145, 20, '2025-08-12 00:00:00'),
	(13, 13, 144, 20, '2025-08-13 00:00:00'),
	(14, 14, 129, 20, '2025-08-14 00:00:00'),
	(15, 15, 137, 20, '2025-08-15 00:00:00'),
	(16, 16, 148, 20, '2025-08-16 00:00:00'),
	(17, 17, 123, 20, '2025-08-17 00:00:00'),
	(18, 18, 136, 20, '2025-08-18 00:00:00'),
	(19, 19, 121, 20, '2025-08-19 00:00:00'),
	(20, 20, 139, 20, '2025-08-20 00:00:00'),
	(21, 21, 125, 20, '2025-08-21 00:00:00'),
	(22, 22, 132, 20, '2025-08-22 00:00:00'),
	(23, 23, 145, 20, '2025-08-23 00:00:00'),
	(24, 24, 128, 20, '2025-08-24 00:00:00'),
	(25, 25, 119, 20, '2025-08-25 00:00:00'),
	(26, 26, 134, 20, '2025-08-01 00:00:00'),
	(27, 27, 120, 20, '2025-08-02 00:00:00'),
	(28, 28, 131, 20, '2025-08-03 00:00:00'),
	(29, 29, 138, 20, '2025-08-04 00:00:00'),
	(30, 30, 146, 20, '2025-08-05 00:00:00'),
	(31, 31, 126, 20, '2025-08-06 00:00:00'),
	(32, 32, 139, 20, '2025-08-07 00:00:00'),
	(33, 33, 141, 20, '2025-08-08 00:00:00'),
	(34, 34, 143, 20, '2025-08-09 00:00:00'),
	(35, 35, 124, 20, '2025-08-10 00:00:00'),
	(36, 36, 137, 20, '2025-08-11 00:00:00'),
	(37, 37, 149, 20, '2025-08-12 00:00:00'),
	(38, 38, 155, 20, '2025-08-13 00:00:00'),
	(39, 39, 132, 20, '2025-08-14 00:00:00'),
	(40, 40, 150, 20, '2025-08-15 00:00:00'),
	(41, 41, 143, 20, '2025-08-16 00:00:00'),
	(42, 42, 127, 20, '2025-08-17 00:00:00'),
	(43, 43, 138, 20, '2025-08-18 00:00:00'),
	(44, 44, 135, 20, '2025-08-19 00:00:00'),
	(45, 45, 152, 20, '2025-08-20 00:00:00'),
	(46, 46, 147, 20, '2025-08-21 00:00:00'),
	(47, 47, 128, 20, '2025-08-22 00:00:00'),
	(48, 48, 120, 20, '2025-08-23 00:00:00'),
	(49, 49, 136, 20, '2025-08-24 00:00:00'),
	(50, 50, 153, 20, '2025-08-25 00:00:00'),
	(51, 51, 101, 20, '2025-08-26 20:25:33'),
	(52, 52, 102, 20, '2025-08-26 20:25:33'),
	(53, 53, 103, 20, '2025-08-26 20:25:33'),
	(54, 54, 104, 20, '2025-08-26 20:25:33'),
	(55, 55, 105, 20, '2025-08-26 20:25:33'),
	(56, 56, 106, 20, '2025-08-26 20:25:33'),
	(57, 57, 107, 20, '2025-08-26 20:25:33'),
	(58, 58, 108, 20, '2025-08-26 20:25:33'),
	(59, 59, 109, 20, '2025-08-26 20:25:33'),
	(60, 60, 110, 20, '2025-08-26 20:25:33'),
	(61, 61, 111, 20, '2025-08-26 20:25:33'),
	(62, 62, 112, 20, '2025-08-26 20:25:33'),
	(63, 63, 113, 20, '2025-08-26 20:25:33'),
	(64, 64, 114, 20, '2025-08-26 20:25:33'),
	(65, 65, 115, 20, '2025-08-26 20:25:33'),
	(66, 66, 116, 20, '2025-08-26 20:25:33'),
	(67, 67, 117, 20, '2025-08-26 20:25:33'),
	(68, 68, 118, 20, '2025-08-26 20:25:33'),
	(69, 69, 119, 20, '2025-08-26 20:25:33'),
	(70, 70, 120, 20, '2025-08-26 20:25:33'),
	(71, 71, 121, 20, '2025-08-26 20:25:33'),
	(72, 72, 122, 20, '2025-08-26 20:25:33');

INSERT INTO `item` (`id`, `serial`, `fecha_ingreso`, `fecha_salida`, `estado`, `precio`, `productos_id`) VALUES
	(1, 'SN0001', '2025-01-05', NULL, 1, 1200, 1),
	(2, 'SN0002', '2025-01-06', NULL, 1, 1150, 1),
	(3, 'SN0003', '2025-01-06', '2025-02-01', 0, 890, 2),
	(4, 'SN0004', '2025-01-07', NULL, 1, 950, 2),
	(5, 'SN0005', '2025-01-08', '2025-02-05', 0, 1400, 3),
	(6, 'SN0006', '2025-01-08', NULL, 1, 1350, 3),
	(7, 'SN0007', '2025-01-09', NULL, 1, 1100, 4),
	(8, 'SN0008', '2025-01-09', NULL, 1, 1150, 4),
	(9, 'SN0009', '2025-01-10', '2025-02-12', 0, 200, 5),
	(10, 'SN0010', '2025-01-10', NULL, 1, 210, 5),
	(11, 'SN0011', '2025-01-11', NULL, 1, 2500, 6),
	(12, 'SN0012', '2025-01-11', NULL, 1, 2400, 6),
	(13, 'SN0013', '2025-01-12', '2025-02-20', 0, 2800, 7),
	(14, 'SN0014', '2025-01-12', NULL, 1, 2700, 7),
	(15, 'SN0015', '2025-01-13', NULL, 1, 1200, 8),
	(16, 'SN0016', '2025-01-13', NULL, 1, 1300, 9),
	(17, 'SN0017', '2025-01-14', NULL, 1, 450, 10),
	(18, 'SN0018', '2025-01-14', '2025-02-18', 0, 460, 10),
	(19, 'SN0019', '2025-01-15', NULL, 1, 320, 11),
	(20, 'SN0020', '2025-01-15', NULL, 1, 310, 11),
	(21, 'SN0021', '2025-01-16', NULL, 1, 3500, 12),
	(22, 'SN0022', '2025-01-16', NULL, 1, 3700, 13),
	(23, 'SN0023', '2025-01-17', NULL, 1, 2200, 14),
	(24, 'SN0024', '2025-01-17', '2025-02-25', 0, 2150, 15),
	(25, 'SN0025', '2025-01-18', NULL, 1, 600, 16),
	(26, 'SN0026', '2025-01-18', NULL, 1, 350, 17),
	(27, 'SN0027', '2025-01-19', NULL, 1, 280, 18),
	(28, 'SN0028', '2025-01-19', '2025-02-28', 0, 320, 19),
	(29, 'SN0029', '2025-01-20', NULL, 1, 1500, 20),
	(30, 'SN0030', '2025-01-20', NULL, 1, 2200, 21),
	(31, 'SN0031', '2025-01-21', NULL, 1, 1800, 22),
	(32, 'SN0032', '2025-01-21', NULL, 1, 1200, 23),
	(33, 'SN0033', '2025-01-22', NULL, 1, 700, 24),
	(34, 'SN0034', '2025-01-22', NULL, 1, 250, 25),
	(35, 'SN0035', '2025-01-23', '2025-03-01', 0, 80, 26),
	(36, 'SN0036', '2025-01-23', NULL, 1, 350, 27),
	(37, 'SN0037', '2025-01-24', NULL, 1, 150, 28),
	(38, 'SN0038', '2025-01-24', NULL, 1, 220, 29),
	(39, 'SN0039', '2025-01-25', NULL, 1, 110, 30),
	(40, 'SN0040', '2025-01-25', NULL, 1, 120, 31),
	(41, 'SN0041', '2025-01-26', '2025-03-05', 0, 420, 32),
	(42, 'SN0042', '2025-01-26', NULL, 1, 390, 33),
	(43, 'SN0043', '2025-01-27', NULL, 1, 300, 34),
	(44, 'SN0044', '2025-01-27', NULL, 1, 200, 35),
	(45, 'SN0045', '2025-01-28', NULL, 1, 450, 36),
	(46, 'SN0046', '2025-01-28', NULL, 1, 180, 37),
	(47, 'SN0047', '2025-01-29', NULL, 1, 700, 38),
	(48, 'SN0048', '2025-01-29', NULL, 1, 320, 39),
	(49, 'SN0049', '2025-01-30', NULL, 1, 150, 40),
	(50, 'SN0050', '2025-01-30', NULL, 1, 600, 41),
	(51, 'SN0051', '2025-01-31', NULL, 1, 2200, 42),
	(52, 'SN0052', '2025-01-31', NULL, 1, 450, 43),
	(53, 'SN0053', '2025-02-01', NULL, 1, 800, 44),
	(54, 'SN0054', '2025-02-01', NULL, 1, 100, 45),
	(55, 'SN0055', '2025-02-02', NULL, 1, 950, 46),
	(56, 'SN0056', '2025-02-02', NULL, 1, 150, 47),
	(57, 'SN0057', '2025-02-03', NULL, 1, 120, 48),
	(58, 'SN0058', '2025-02-03', NULL, 1, 480, 49),
	(59, 'SN0059', '2025-02-04', NULL, 1, 250, 50),
	(60, 'SN0060', '2025-02-04', NULL, 1, 300, 51);

INSERT INTO `pedidos` (`id_pedido`, `cliente_id`, `fecha_pedido`, `estado`, `total`) VALUES
	(1, 1, '2025-01-05 00:00:00', '1', 2500),
	(2, 2, '2025-01-06 00:00:00', '1', 1200),
	(3, 3, '2025-01-06 00:00:00', '0', 890),
	(4, 4, '2025-01-07 00:00:00', '1', 1750),
	(5, 5, '2025-01-07 00:00:00', '1', 2200),
	(6, 2, '2025-01-08 00:00:00', '0', 3100),
	(7, 6, '2025-01-08 00:00:00', '1', 950),
	(8, 7, '2025-01-09 00:00:00', '1', 1400),
	(9, 8, '2025-01-09 00:00:00', '1', 200),
	(10, 1, '2025-01-10 00:00:00', '0', 1800),
	(11, 9, '2025-01-10 00:00:00', '1', 2700),
	(12, 10, '2025-01-11 00:00:00', '1', 3200),
	(13, 11, '2025-01-11 00:00:00', '0', 420),
	(14, 12, '2025-01-12 00:00:00', '1', 350),
	(15, 13, '2025-01-12 00:00:00', '1', 1600),
	(16, 14, '2025-01-13 00:00:00', '1', 2200),
	(17, 3, '2025-01-13 00:00:00', '0', 1250),
	(18, 15, '2025-01-14 00:00:00', '1', 980),
	(19, 16, '2025-01-14 00:00:00', '1', 650),
	(20, 17, '2025-01-15 00:00:00', '1', 3000),
	(21, 5, '2025-01-15 00:00:00', '0', 850),
	(22, 18, '2025-01-16 00:00:00', '1', 1400),
	(23, 19, '2025-01-16 00:00:00', '1', 700),
	(24, 20, '2025-01-17 00:00:00', '0', 1100),
	(25, 8, '2025-01-17 00:00:00', '1', 2900),
	(26, 6, '2025-01-18 00:00:00', '1', 220),
	(27, 10, '2025-01-18 00:00:00', '1', 1450),
	(28, 14, '2025-01-19 00:00:00', '0', 580),
	(29, 7, '2025-01-19 00:00:00', '1', 3150),
	(30, 11, '2025-01-20 00:00:00', '1', 900),
	(31, 4, '2025-01-20 00:00:00', '0', 1700),
	(32, 15, '2025-01-21 00:00:00', '1', 250),
	(33, 12, '2025-01-21 00:00:00', '1', 890),
	(34, 1, '2025-01-22 00:00:00', '1', 1200),
	(35, 9, '2025-01-22 00:00:00', '0', 1990),
	(36, 17, '2025-01-23 00:00:00', '1', 620),
	(37, 3, '2025-01-23 00:00:00', '1', 2000),
	(38, 18, '2025-01-24 00:00:00', '1', 800),
	(39, 20, '2025-01-24 00:00:00', '0', 430),
	(40, 19, '2025-01-25 00:00:00', '1', 3100),
	(41, 16, '2025-01-25 00:00:00', '1', 560),
	(42, 2, '2025-01-26 00:00:00', '1', 2150),
	(43, 7, '2025-01-26 00:00:00', '0', 330),
	(44, 5, '2025-01-27 00:00:00', '1', 2750),
	(45, 13, '2025-01-27 00:00:00', '1', 1500),
	(46, 8, '2025-01-28 00:00:00', '0', 990),
	(47, 11, '2025-01-28 00:00:00', '1', 2200),
	(48, 14, '2025-01-29 00:00:00', '1', 310),
	(49, 6, '2025-01-29 00:00:00', '1', 450),
	(50, 19, '2025-01-30 00:00:00', '1', 2800),
	(51, 1, '2025-08-26 18:51:14', 'Procesando', 200),
	(52, 1, '2025-08-26 19:22:05', 'Procesando', 876443),
	(53, 1, '2025-08-26 19:32:14', 'Procesando', 100000),
	(54, 1, '2025-08-26 19:34:59', 'Procesando', 102639),
	(55, 1, '2025-08-26 19:35:01', 'Procesando', 102639),
	(56, 2, '2025-08-26 19:39:22', 'Procesando', 410556),
	(57, 2, '2025-08-26 20:01:05', 'Procesando', 1698300);

INSERT INTO `detalle_pedido` (`id_detalle`, `pedido_id`, `producto_id`, `cantidad`, `subtotal`) VALUES
	(1, 1, 5, 2, 60000),
	(2, 1, 12, 1, 15000),
	(3, 2, 8, 3, 75000),
	(4, 2, 20, 2, 46000),
	(5, 3, 15, 1, 25000),
	(6, 3, 7, 4, 120000),
	(7, 4, 30, 2, 54000),
	(8, 4, 25, 1, 28000),
	(9, 5, 10, 5, 100000),
	(10, 6, 3, 2, 70000),
	(11, 6, 17, 1, 22000),
	(12, 7, 9, 3, 69000),
	(13, 7, 27, 2, 80000),
	(14, 8, 14, 1, 18000),
	(15, 8, 19, 1, 26000),
	(16, 9, 2, 2, 64000),
	(17, 9, 22, 1, 31000),
	(18, 10, 11, 4, 88000),
	(19, 11, 6, 2, 52000),
	(20, 11, 28, 1, 40000),
	(21, 12, 13, 3, 60000),
	(22, 13, 4, 2, 54000),
	(23, 13, 29, 1, 37000),
	(24, 14, 18, 1, 20000),
	(25, 14, 21, 2, 58000),
	(26, 15, 16, 2, 46000),
	(27, 15, 24, 3, 96000),
	(28, 16, 1, 1, 28000),
	(29, 17, 5, 2, 60000),
	(30, 18, 7, 1, 30000),
	(31, 19, 10, 4, 80000),
	(32, 20, 3, 2, 70000),
	(33, 21, 8, 3, 75000),
	(34, 22, 12, 2, 30000),
	(35, 23, 14, 2, 36000),
	(36, 24, 15, 1, 25000),
	(37, 25, 17, 2, 44000),
	(38, 26, 20, 3, 69000),
	(39, 27, 22, 1, 31000),
	(40, 28, 25, 2, 56000),
	(41, 29, 30, 1, 27000),
	(42, 30, 2, 2, 64000),
	(43, 31, 6, 3, 78000),
	(44, 32, 9, 1, 23000),
	(45, 33, 11, 2, 44000),
	(46, 34, 13, 4, 80000),
	(47, 35, 16, 1, 23000),
	(48, 36, 18, 3, 60000),
	(49, 37, 19, 2, 52000),
	(50, 38, 21, 1, 29000),
	(51, 39, 23, 2, 54000),
	(52, 40, 26, 1, 31000),
	(53, 41, 28, 3, 120000),
	(54, 42, 4, 2, 54000),
	(55, 43, 5, 1, 30000),
	(56, 44, 7, 2, 60000),
	(57, 45, 10, 1, 20000),
	(58, 46, 12, 2, 30000),
	(59, 47, 14, 3, 54000),
	(60, 48, 17, 1, 22000),
	(61, 49, 20, 2, 46000),
	(62, 50, 25, 1, 28000),
	(63, 1, 1, 1, 28000),
	(64, 2, 19, 2, 52000),
	(65, 3, 30, 3, 81000),
	(66, 4, 8, 2, 50000),
	(67, 5, 16, 1, 23000),
	(68, 6, 23, 3, 81000),
	(69, 7, 26, 2, 62000),
	(70, 8, 29, 1, 37000),
	(71, 9, 6, 2, 52000),
	(72, 10, 15, 1, 25000),
	(73, 11, 9, 1, 23000),
	(74, 12, 18, 2, 40000),
	(75, 13, 22, 3, 93000),
	(76, 14, 24, 1, 32000),
	(77, 15, 27, 2, 80000),
	(78, 16, 11, 2, 44000),
	(79, 17, 13, 1, 20000),
	(80, 18, 20, 1, 23000),
	(81, 19, 25, 2, 56000),
	(82, 20, 3, 1, 35000),
	(83, 21, 5, 1, 30000),
	(84, 22, 8, 2, 50000),
	(85, 23, 17, 2, 44000),
	(86, 24, 30, 1, 27000),
	(87, 25, 7, 3, 90000),
	(88, 26, 21, 1, 29000),
	(89, 27, 10, 2, 40000),
	(90, 28, 12, 1, 15000),
	(91, 29, 14, 2, 36000),
	(92, 30, 19, 2, 52000),
	(93, 31, 16, 3, 69000),
	(94, 32, 22, 1, 31000),
	(95, 33, 4, 2, 54000),
	(96, 34, 6, 1, 26000),
	(97, 35, 9, 2, 46000),
	(98, 36, 18, 1, 20000),
	(99, 37, 25, 2, 56000),
	(100, 38, 29, 1, 37000),
	(101, 51, 2, 3, 150),
	(102, 51, 5, 1, 50),
	(106, 53, 61, 2, 50000),
	(107, 54, 63, 1, 102639),
	(108, 55, 63, 1, 102639),
	(109, 56, 63, 4, 410556),
	(110, 57, 63, 10, 1026390),
	(111, 57, 66, 9, 629910),
	(112, 57, 71, 1, 25999),
	(113, 57, 65, 1, 15999);

CREATE VIEW VwInventarioPorProducto AS
SELECT
    i.id AS IdInventario,
    i.producto_id AS IdProducto,
    p.nombre AS NombreProducto,
    i.cantidad AS CantidadEnInventario
FROM
    inventario i
JOIN
    productos p ON i.producto_id = p.id;

DELIMITER //
CREATE PROCEDURE SP_BuscarInventarioPorNombre(
    IN nombre_buscado VARCHAR(255)
)
BEGIN
    SELECT
        IdProducto,
        NombreProducto,
        CantidadEnInventario
    FROM
        VwInventarioPorProducto
    WHERE
        NombreProducto LIKE CONCAT('%', nombre_buscado, '%');
END //
DELIMITER ;


CALL SP_BuscarInventarioPorNombre('Teclado');

	UPDATE pedidos
	SET vendedor_id = 1;
	
	UPDATE productos
SET vendedor_id = 1;

CREATE VIEW VwVentasVendedor1 AS
SELECT
    YEAR(p.fecha_pedido) AS Anio,
    MONTH(p.fecha_pedido) AS Mes,
    DAY(p.fecha_pedido) AS Dia,
    SUM(dp.subtotal) AS TotalVenta
FROM
    pedidos p
JOIN
    detalle_pedido dp ON p.id_pedido = dp.pedido_id
WHERE
    p.vendedor_id = 1
GROUP BY
    Anio, Mes, Dia
ORDER BY
    Anio ASC, Mes ASC, Dia ASC;


DELIMITER //
DROP PROCEDURE IF EXISTS SP_ConsultarVentasVendedor;
CREATE PROCEDURE SP_ConsultarVentasVendedor(
    IN anio_in INT,
    IN mes_in INT,
    IN dia_in INT
)
BEGIN
    -- Si solo se proporciona el año, agrupa por año para obtener el total anual.
    IF anio_in IS NOT NULL AND mes_in IS NULL AND dia_in IS NULL THEN
        SELECT SUM(TotalVenta) AS TotalVentasAnuales
        FROM VwVentasVendedor1
        WHERE Anio = anio_in;

    -- Si se proporciona el año y el mes, agrupa por mes para obtener el total mensual.
    ELSEIF anio_in IS NOT NULL AND mes_in IS NOT NULL AND dia_in IS NULL THEN
        SELECT SUM(TotalVenta) AS TotalVentasMensuales
        FROM VwVentasVendedor1
        WHERE Anio = anio_in AND Mes = mes_in;
    
    -- Si se proporcionan el año, mes y día, muestra el total diario.
    ELSEIF anio_in IS NOT NULL AND mes_in IS NOT NULL AND dia_in IS NOT NULL THEN
        SELECT SUM(TotalVenta) AS TotalVentasDiarias
        FROM VwVentasVendedor1
        WHERE Anio = anio_in AND Mes = mes_in AND Dia = dia_in;

    -- Si no se proporciona ningún parámetro, muestra las ventas totales por año.
    ELSE
        SELECT Anio, SUM(TotalVenta) AS TotalVentasAnuales
        FROM VwVentasVendedor1
        GROUP BY Anio;
    END IF;
END //
DELIMITER ;



CALL SP_ConsultarVentasVendedor(2025, NULL, NULL);