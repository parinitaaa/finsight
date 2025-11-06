const express = require("express");
const protect = require("../middleware/authMiddleware");
const pool = require("../config/db");

const router = express.Router();

// ✅ Add a new expense
router.post("/", protect, async (req, res) => {
  try {
    const { title, amount, category, description, payment_method, date } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({ msg: "Title,amount and category are required" });
    }

    const newExpense = await pool.query(
      `INSERT INTO finance (user_id, title, amount, category, description, payment_method, date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.id, title, amount, category, description, payment_method, date || new Date()]
    );

    res.status(201).json({ msg: "Expense added successfully", expense: newExpense.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Get all expenses for the logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const expenses = await pool.query(
      "SELECT * FROM finance WHERE user_id = $1 ORDER BY date DESC",[req.user.id]);
    res.json(expenses.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});
// ✅ Get a single expense by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await pool.query(
      "SELECT * FROM finance WHERE id=$1 AND user_id=$2",
      [id, req.user.id]
    );

    if (expense.rows.length === 0) {
      return res.status(404).json({ msg: "Expense not found or not authorized" });
    }

    res.json(expense.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


// ✅ Update an expense
router.put("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category, description, payment_method, date } = req.body;

    const updated = await pool.query(
      `UPDATE finance 
       SET title=$1, amount=$2, category=$3, description=$4, payment_method=$5, date=$6
       WHERE id=$7 AND user_id=$8
       RETURNING *`,
      [title, amount, category, description, payment_method, date, id, req.user.id]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ msg: "Expense not found or not authorized" });
    }

    res.json({ msg: "Expense updated successfully", expense: updated.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Delete an expense
router.delete("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await pool.query(
      "DELETE FROM finance WHERE id=$1 AND user_id=$2 RETURNING *",
      [id, req.user.id]
    );

    if (deleted.rows.length === 0) {
      return res.status(404).json({ msg: "Expense not found or not authorized" });
    }

    res.json({ msg: "Expense deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
