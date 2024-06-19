const express = require("express");
const cors = require("cors");
const pgPromise = require("pg-promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const pgp = pgPromise();

// Подключение к базе данных
const config = {
  host: "172.20.7.6",
  user: "st",
  password: "pwd",
  database: "1991_05_PM11",
};
const db = pgp(config);

// Middleware
app.use(express.json());
app.use(cors());

// Роутинг для авторизации
app.post("/api/auth/login", async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await db.one(`SELECT * FROM "user" WHERE login = $1`, [login]);
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      const token = jwt.sign(
        {
          userId: user.id,
        },
        "c83570170d1ec75a3df2674fad57d6d3c6826b4720dff3688fdb162c38de9874",
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({
        token,
        user,
      });
    } else {
      res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Неверный логин или пароль",
    });
  }
});

// Маршруты для книг
app.get("/api/books", async (req, res) => {
  try {
    const books = await db.any("SELECT * FROM book");
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});

app.post("/api/books", async (req, res) => {
  try {
    const { book_name, janr_id, avtors } = req.body;
    const newBook = await db.one(
      "INSERT INTO book (book_name, janr_id) VALUES ($1, $2) RETURNING *",
      [book_name, janr_id]
    );

    for (const avtorId of avtors) {
      await db.none(
        "INSERT INTO avtor_book (book_id, avtor_id) VALUES ($1, $2)",
        [newBook.id, avtorId]
      );
    }

    res.json(newBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});

app.put("/api/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { book_name, janr_id, avtors } = req.body;
    const updatedBook = await db.one(
      "UPDATE book SET book_name = $1, janr_id = $2 WHERE id = $3 RETURNING *",
      [book_name, janr_id, id]
    );

    await db.none("DELETE FROM avtor_book WHERE book_id = $1", [id]);

    for (const avtorId of avtors) {
      await db.none(
        "INSERT INTO avtor_book (book_id, avtor_id) VALUES ($1, $2)",
        [id, avtorId]
      );
    }

    res.json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});

app.delete("/api/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.none("DELETE FROM book WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});

// Маршруты для авторов
app.get("/api/authors", async (req, res) => {
  try {
    const authors = await db.any("SELECT * FROM avtor");
    res.json(authors);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});

app.post("/api/authors", async (req, res) => {
  try {
    const { fio } = req.body;
    const newAuthor = await db.one(
      "INSERT INTO avtor (fio) VALUES ($1) RETURNING *",
      [fio]
    );
    res.json(newAuthor);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});

app.put("/api/authors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fio } = req.body;
    const updatedAuthor = await db.one(
      "UPDATE avtor SET fio = $1 WHERE id = $2 RETURNING *",
      [fio, id]
    );
    res.json(updatedAuthor);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});

app.delete("/api/authors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.none("DELETE FROM avtor WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});

// Маршруты для жанров
app.get("/api/genres", async (req, res) => {
  try {
    const genres = await db.any("SELECT * FROM janr");
    res.json(genres);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});

app.post("/api/genres", async (req, res) => {
  try {
    const { nazvanie } = req.body;
    const newGenre = await db.one(
      "INSERT INTO janr (nazvanie) VALUES ($1) RETURNING *",
      [nazvanie]
    );
    res.json(newGenre);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});

app.put("/api/genres/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nazvanie } = req.body;
    const updatedGenre = await db.one(
      "UPDATE janr SET nazvanie = $1 WHERE id = $2 RETURNING *",
      [nazvanie, id]
    );
    res.json(updatedGenre);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});

app.delete("/api/genres/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.none("DELETE FROM janr WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});
// Маршруты для комментариев
app.get("/api/comments", async (req, res) => {
  try {
    const comments = await db.any(`
      SELECT comment.*, "user".fio 
      FROM comment 
      JOIN "user" ON comment.user_id = "user".id
    `);
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});

app.post("/api/comments", async (req, res) => {
  try {
    const { text, time, user_id } = req.body;
    const newComment = await db.one(
      "INSERT INTO comment (text, time, user_id) VALUES ($1, $2, $3) RETURNING *",
      [text, time, user_id]
    );
    res.json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});
app.put("/api/comments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { text, time, user_id } = req.body;
    const updatedComment = await db.one(
      "UPDATE comment SET text = $1, time = $2, user_id = $3 WHERE id = $4 RETURNING *",
      [text, time, user_id, id]
    );
    res.json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});
app.delete("/api/comments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.none("DELETE FROM comment WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});
// Маршруты для рейтингов
// Маршруты для рейтингов
app.get("/api/ratings", async (req, res) => {
  try {
    const ratings = await db.any("SELECT * FROM ratings");
    res.json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});

app.post("/api/ratings", async (req, res) => {
  try {
    const { ocenka, comment_id } = req.body;
    const newRating = await db.one(
      "INSERT INTO ratings (ocenka, comment_id) VALUES ($1, $2) RETURNING *",
      [ocenka, comment_id]
    );
    res.json(newRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});

app.put("/api/ratings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { ocenka, comment_id } = req.body;
    const updatedRating = await db.one(
      "UPDATE ratings SET ocenka = $1, comment_id = $2 WHERE id = $3 RETURNING *",
      [ocenka, comment_id, id]
    );
    res.json(updatedRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});

app.delete("/api/ratings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.none("DELETE FROM ratings WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});

// Маршруты для пользователей
app.get("/api/users", async (req, res) => {
  try {
    const users = await db.any('SELECT * FROM "user"');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});
app.post("/api/users", async (req, res) => {
  const { fio, login, password } = req.body;

  try {
    const existingUser = await db.oneOrNone(
      'SELECT * FROM "user" WHERE login = $1',
      [login]
    );

    if (existingUser) {
      return res.status(409).json({ message: "Пользователь с таким логином уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.one(
      'INSERT INTO "user" (fio, login, password, role_id) VALUES ($1, $2, $3, 2) RETURNING *',
      [fio, login, hashedPassword]
    );

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});
app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fio, login, password, role_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await db.one(
      'UPDATE "user" SET fio = $1, login = $2, password = $3, role_id = $4 WHERE id = $5 RETURNING *',
      [fio, login, hashedPassword, role_id, id]
    );
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});
app.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.none('DELETE FROM "user" WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});
// Обслуживание React-приложения
app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
