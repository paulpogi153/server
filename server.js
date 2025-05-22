const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chordify_db',
});

// GET all artists
app.get('/artists', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err 
            console.log('Connected as id ${connection.threadId}');
            connection.query('SELECT * FROM artists',(err, rows) => {
                connection.release();
                if(!err) {
                    res.send(rows);
                } else {
                    console.log(err);
                }
            })
        })
    })
// GET artist by ID
app.get('/artists/:id', (req, res) => {
  const id = req.params.id;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    connection.query(
      'SELECT*FROM artists WHERE artist_id = ?',
      [id],
      (err, rows) => {
        connection.release();
        if (!err) {
          if (rows.length) {
            res.send(rows[0]);
          } else {
            res.status(404).send("Artist not found.");
          }
        } else {
          console.error(err);
          res.status(500).send("Error fetching artist.");
        }
      }
    );
  });
});

// GET all songs
app.get('/songs', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    connection.query('SELECT * FROM songs', (err, rows) => {
      connection.release();
      if (!err) {
        res.send(rows);
      } else {
        console.error(err);
        res.status(500).send("Error fetching songs.");
      }
    });
  });
});

// GET song by ID
app.get('/songs/:id', (req, res) => {
  const id = req.params.id;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    connection.query(
      'SELECT * FROM songs WHERE song_id = ?',
      [id],
      (err, rows) => {
        connection.release();
        if (!err) {
          if (rows.length) {
            res.send(rows[0]);
          } else {
            res.status(404).send("Song not found.");
          }
        } else {
          console.error(err);
          res.status(500).send("Error fetching song.");
        }
      }
    );
  });
});

// GET all chords
app.get('/chords', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    connection.query('SELECT * FROM chords', (err, rows) => {
      connection.release();
      if (!err) {
        res.send(rows);
      } else {
        console.error(err);
        res.status(500).send("Error fetching chords.");
      }
    });
  });
});

// GET chord by ID
app.get('/chords/:id', (req, res) => {
  const id = req.params.id;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    connection.query(
      'SELECT * FROM chords WHERE id = ?',
      [id],
      (err, rows) => {
        connection.release();
        if (!err) {
          if (rows.length) {
            res.send(rows[0]);
          } else {
            res.status(404).send("Chord not found.");
          }
        } else {
          console.error(err);
          res.status(500).send("Error fetching chord.");
        }
      }
    );
  });
});

// POST new artist
app.post('/artists', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    const params = req.body;
    connection.query('INSERT INTO artist SET ?', params, (err, result) => {
      connection.release();
      if (!err) {
        res.send(`Artist with ID ${result.insertId} has been added.`);
      } else {
        console.error(err);
        res.status(500).send("Error adding artist.");
      }
    });
  });
});

// POST new song
app.post('/songs', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    const params = req.body;
    connection.query('INSERT INTO songs SET ?', params, (err, result) => {
      connection.release();
      if (!err) {
        res.send(`Song with ID ${result.insertId} has been added.`);
      } else {
        console.error(err);
        res.status(500).send("Error adding song.");
      }
    });
  });
});

// POST new chord
app.post('/chords', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    const params = req.body;
    connection.query('INSERT INTO chords SET ?', params, (err, result) => {
      connection.release();
      if (!err) {
        res.send(`Chord with ID ${result.insertId} has been added.`);
      } else {
        console.error(err);
        res.status(500).send("Error adding chord.");
      }
    });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
