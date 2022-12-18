import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

open({
  filename: 'test.db',
  driver: sqlite3.Database
}).then((db) => {
  db.all('select * from test;').then((value) =>{console.log(value)})
  // do your thing
})