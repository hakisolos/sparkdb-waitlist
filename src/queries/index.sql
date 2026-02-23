create table users (
    id serial primary key,
    fullname varchar(255) not null,
    email varchar(255) not null unique
);