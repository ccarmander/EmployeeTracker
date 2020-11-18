DROP DATABASE IF EXISTS employees;

CREATE DATABASE employees;

USE employees;

CREATE TABLE department (
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(30) NOT NULL,

PRIMARY KEY(id)was

);

CREATE TABLE role (

id INT NOT NULL AUTO_INCREMENT,
title VARCHAR(30) NOT NULL,
salary DECIMAL(10,2) NOT NULL,
department_id INT NOT NULL,da

PRIMARY KEY (id)

);

CREATE TABLE employee (

sdfirst_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
manager_id INT,

PRIMARY KEY (id)

);