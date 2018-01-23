drop database if exists bamazon;
create database bamazon;

use bamazon;

create table productlist(
item_id INT AUTO_INCREMENT NOT null,
product_name varchar(50) NULL,
department_name varchar(50) NULL,
price int(15) NULL,
quantity int(50) Null,
primary key (item_id)
)