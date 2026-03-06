-- Script para crear la estructura de la base de datos "parking_lot"
CREATE DATABASE IF NOT EXISTS parking_lot CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE parking_lot;

-- 1. Tabla Perfil de Usuario
CREATE TABLE IF NOT EXISTS PERFIL_USUARIO (
  id_perfil_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre_perfil VARCHAR(50) NOT NULL
);

-- 2. Tabla Usuario
CREATE TABLE IF NOT EXISTS USUARIO (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  tipo_documento VARCHAR(5) NOT NULL,
  numero_documento VARCHAR(20) UNIQUE NOT NULL,
  primer_nombre VARCHAR(50) NOT NULL,
  segundo_nombre VARCHAR(50),
  primer_apellido VARCHAR(50) NOT NULL,
  segundo_apellido VARCHAR(50),
  direccion_correo VARCHAR(100) NOT NULL,
  numero_celular VARCHAR(20) NOT NULL,
  foto_perfil VARCHAR(255),
  estado ENUM('activo', 'inactivo') DEFAULT 'activo',
  clave VARCHAR(255) NOT NULL,
  PERFIL_USUARIO_id INT,
  FOREIGN KEY (PERFIL_USUARIO_id) REFERENCES PERFIL_USUARIO(id_perfil_usuario) ON DELETE SET NULL
);

-- 3. Tabla Vehículo
CREATE TABLE IF NOT EXISTS VEHICULO (
  id_vehiculo INT AUTO_INCREMENT PRIMARY KEY,
  placa VARCHAR(20) UNIQUE NOT NULL,
  usuario_id INT,
  FOREIGN KEY (usuario_id) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
);

-- 4. Tabla Tipo de Celda
CREATE TABLE IF NOT EXISTS TIPO_CELDA (
  id_tipo_celda INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(50) NOT NULL
);

-- 5. Tabla Celda
CREATE TABLE IF NOT EXISTS CELDA (
  id_celda INT AUTO_INCREMENT PRIMARY KEY,
  numero_celda VARCHAR(20) UNIQUE NOT NULL,
  estado ENUM('disponible', 'ocupada', 'mantenimiento') DEFAULT 'disponible',
  TIPO_CELDA_id_tipo_celda INT,
  FOREIGN KEY (TIPO_CELDA_id_tipo_celda) REFERENCES TIPO_CELDA(id_tipo_celda) ON DELETE SET NULL
);

-- 6. Tabla Acceso
CREATE TABLE IF NOT EXISTS ACCESO (
  id_acceso INT AUTO_INCREMENT PRIMARY KEY,
  vehiculo_id INT,
  celda_id INT,
  usuario_id INT,
  fecha_hora_entrada DATETIME NOT NULL,
  fecha_hora_salida DATETIME,
  estado ENUM('activo', 'finalizado') DEFAULT 'activo',
  FOREIGN KEY (vehiculo_id) REFERENCES VEHICULO(id_vehiculo) ON DELETE CASCADE,
  FOREIGN KEY (celda_id) REFERENCES CELDA(id_celda) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES USUARIO(id_usuario) ON DELETE SET NULL
);

-- 7. Tabla Incidencia
CREATE TABLE IF NOT EXISTS INCIDENCIA (
  id_incidencia INT AUTO_INCREMENT PRIMARY KEY,
  descripcion TEXT NOT NULL,
  fecha DATETIME NOT NULL,
  estado ENUM('abierta', 'resuelta') DEFAULT 'abierta',
  acceso_id INT,
  usuario_id INT,
  FOREIGN KEY (acceso_id) REFERENCES ACCESO(id_acceso) ON DELETE SET NULL,
  FOREIGN KEY (usuario_id) REFERENCES USUARIO(id_usuario) ON DELETE SET NULL
);

-- Insertar datos iniciales
INSERT INTO PERFIL_USUARIO (nombre_perfil) VALUES ('admin'), ('cliente'), ('operador');
INSERT INTO TIPO_CELDA (descripcion) VALUES ('carro'), ('moto'), ('discapacitado');

-- Insertar algunas celdas de prueba
INSERT INTO CELDA (numero_celda, TIPO_CELDA_id_tipo_celda, estado) VALUES 
('A1', 1, 'disponible'), ('A2', 1, 'disponible'), ('A3', 1, 'disponible'), ('A4', 1, 'disponible'),
('B1', 1, 'disponible'), ('B2', 1, 'disponible'), ('B3', 1, 'disponible'), ('B4', 1, 'disponible'),
('M1', 2, 'disponible'), ('M2', 2, 'disponible'), ('M3', 2, 'disponible'), ('M4', 2, 'disponible'),
('D1', 3, 'disponible'), ('D2', 3, 'disponible');

-- NOTA: El usuario admin lo generaremos con el script hashPasswords.js
