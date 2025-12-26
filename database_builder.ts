//import Database from 'better-sqlite3';
//const db = new Database('./library.db'); //connect to DB

//create a table
// let sql = 'CREATE VIRTUAL TABLE resources USING FTS5(title,author,subject,year,file_type,file_path)';
// db.exec(sql);

// //inserting values into table. file_types: paper, video, book
// const insert = "INSERT INTO resources VALUES ('Consumer Choice and Collective Impact', 'Julia Nefsky', 'Philosophy', '2018', 'paper', 'Nefksy.pdf')"
// db.exec(insert);

//inserting values into table. file_types: paper, video, book
// const alter = db.prepare("ALTER TABLE resources ADD COLUMN views INTEGER");
// alter.run();

// //quering database
// const q = "consumer choice"
// const stmt = db.prepare('SELECT * FROM resources');
// const allUsers = stmt.all(); 

// console.log(allUsers);