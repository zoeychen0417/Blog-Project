/*
 * Upon submission, this file should contain the SQL script to initialize your database.
 * It should contain all DROP TABLE and CREATE TABLE statments, and any INSERT statements
 * required.
 */
drop table if exists opinion;
drop table if exists comments;
drop table if exists articles;
drop table if exists users;

create table if not exists users (
   user_id integer not null primary key,
   fname varchar(15),
   lname varchar(15),
   username varchar(15) unique not null,
   dob date,
   user_desc varchar(128),
   avatar_icon varchar(128),
   hashed varchar(256),
   salted varchar(256),
   isAdmin integer default 0,
   authToken varchar(128)
);

CREATE table if not EXISTS articles (
  article_id integer not null PRIMARY key,
  title varchar(65),
  post_date date,
  user_id integer,
  article_content text,
  article_image text,
  FOREIGN key (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE table if not EXISTS comments (
  comment_id integer not null PRIMARY KEY,
  comment_content text,
  comment_date date,
  num_of_like integer,
  num_of_dislike integer,
  parent_comment_id INTEGER,
  isChild integer,
  user_id INTEGER,
  article_id INTEGER,
  FOREIGN key (parent_comment_id) REFERENCES comments(comment_id) on delete cascade,
  FOREIGN key (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
  FOREIGN key (article_id) REFERENCES articles (article_id) ON DELETE CASCADE
);

CREATE TABLE if NOT EXISTS opinion (
 user_id INTEGER NOT NULL,
 comment_id INTEGER NOT NULL,
 up INTEGER,
 down INTEGER,
 PRIMARY KEY (user_id, comment_id),
 FOREIGN KEY (user_id) REFERENCES users(user_id) on delete cascade,
 FOREIGN KEY (comment_id) REFERENCES comments(comment_id) ON DELETE CASCADE
);


INSERT into users (user_id, fname, lname, username, dob, user_desc, avatar_icon,hashed,salted,isAdmin)VALUES 
(1, 'Alice', 'White', 'ali01', '1997/04/17', 'I am Alice', 'girl.png','$2b$10$gm3CZh1S5tOd3R0tsk5pIObvVTdw5Th/QmDkswNmHfU3ah6duL9f6','$2b$10$gm3CZh1S5tOd3R0tsk5pIO',1),
(2, 'Bob', 'Black', 'bb02', '1996/07/04', 'I am Bob', 'boy.png','$2b$10$gm3CZh1S5tOd3R0tsk5pIObvVTdw5Th/QmDkswNmHfU3ah6duL9f6','$2b$10$gm3CZh1S5tOd3R0tsk5pIO',0),
(3, 'John', 'Doe', 'jd03',  '2000/12/12', 'I am John Doe', 'people.png','$2b$10$gm3CZh1S5tOd3R0tsk5pIObvVTdw5Th/QmDkswNmHfU3ah6duL9f6','$2b$10$gm3CZh1S5tOd3R0tsk5pIO',0);


INSERT into articles VALUES
(1, 'PLAYINIG WITH FLOWERS: 10 STEPS ON HOW TO CELEBRATE VALENTINES DAY', '6/3/2021, 11:22:26 PM', 2, 'this is ','./images/cover/cover-1.jpg'),
(2, 'HSM Promotes New Alternatives to Foam Shortages & Price Hikes', '12/5/2020, 11:16:26 PM', 1, 'dfsfsd','./images/cover/cover-2.jpg'),
(3, 'UPDATED: HOW YOU CAN HELP SAVE THE ELEPHANTS','3/12/2021, 11:31:50 PM', 3, 'ertyui','./images/cover/cover-3.jpg');

insert into comments values
(1, 'Unlike most gardening magazines, which tend to be homogenized, commercial ventures filled with photos and ads, every gardening blog has a unique personality.', '2020/02/02', 34, 25, null, false, 2, 1),
(2, 'Good article overall, It is not too late to take action on saving the elephants!', '1990/01/01', 9, 7, null, false, 2, 3),
(3, 'I have had countless ‘in real life’ friends come over and ask if I never worked with Article, would I still recommend their products. My answer is always, “Absolutely yes!” Several of my close friends have gone on to purchase tables, sofas, and chairs from Article. I share that to say – if I recommend it to my closest friends its a pretty good sign I am a fan!', '2001/03/03', 11, 0, null, true, 3, 2);

INSERT INTO opinion VALUES
(1, 3, null,null),
(2, 1, true, false),
(3, 2, false,true);