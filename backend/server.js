const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./src/config/config");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Login Route
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM login WHERE user_name = ? AND password = ?";

    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Server error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Invalid username or password" });
        }
        return res.json(results);
    });
});

// Fetch menu data
app.get("/get-data", (req, res) => {
    db.query("SELECT * FROM menu", (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to fetch tasks" });
        res.json(results);
    });
});

// Fetch food details by joining menu & details tables
app.get("/get-food/:menu", (req, res) => {
    const foodName = req.params.menu;

    if (!foodName) {
        console.log("Invalid menu parameter received");
        return res.status(400).json({ error: "Invalid menu name" });
    }

    console.log(`Fetching food details for: ${foodName}`);

    const sql = `
        SELECT menu.menu, menu.path, details.price, details.review 
        FROM menu 
        JOIN details ON menu.menu = details.menu_fk 
        WHERE menu.menu = ?`;

    db.query(sql, [foodName], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (results.length === 0) {
            console.warn(`No food found for: ${foodName}`);
            return res.status(404).json({ error: "Food not found" });
        }

        console.log("Food found:", results[0]);
        res.json(results[0]);
    });
});
app.post("/add-to-cart", (req, res) => {
    const { menu, price, path, review } = req.body;

    if (!menu || !price || !path) {
        return res.status(400).json({ error: "Incomplete food details." });
    }

    const checkQuery = "SELECT * FROM cart WHERE menu = ?";
    db.query(checkQuery, [menu], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error." });

        if (results.length > 0) {
            // Item exists, update quantity and total_price
            const newQuantity = results[0].quantity + 1;
            const newTotalPrice = newQuantity * price;

            const updateQuery = "UPDATE cart SET quantity = ?, total_price = ? WHERE menu = ?";
            db.query(updateQuery, [newQuantity, newTotalPrice, menu], (err) => {
                if (err) return res.status(500).json({ error: "Failed to update quantity." });
                res.json({ message: "Quantity updated!", quantity: newQuantity, total_price: newTotalPrice });
            });
        } else {
            // Insert new item
            const totalPrice = price; // Initial total_price = price * 1
            const insertQuery = "INSERT INTO cart (menu, price, total_price, path, review, quantity) VALUES (?, ?, ?, ?, ?, ?)";

            db.query(insertQuery, [menu, price, totalPrice, path, review, 1], (err) => {
                if (err) return res.status(500).json({ error: "Failed to insert item." });
                res.json({ message: "Item added to cart!" });
            });
        }
    });
});



app.get("/get-cart", (req, res) => {
    db.query("SELECT * FROM cart", (err, results) => {
        if (err) return res.status(500).json({ error: "Database error." });
        res.json(results);
    });
});

app.put("/update-quantity/:menu", (req, res) => {
    const { menu } = req.params;

    // Get current price and quantity
    const checkQuery = "SELECT quantity, price FROM cart WHERE menu = ?";
    db.query(checkQuery, [menu], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error." });

        if (results.length === 0) {
            return res.status(404).json({ error: "Item not found in cart." });
        }

        const { quantity, price } = results[0];
        const newQuantity = quantity + 1;
        const newTotalPrice = newQuantity * price; // Calculate new total price

        // Update quantity and total price
        const updateQuery = "UPDATE cart SET quantity = ?, total_price = ? WHERE menu = ?";
        db.query(updateQuery, [newQuantity, newTotalPrice, menu], (err) => {
            if (err) return res.status(500).json({ error: "Failed to update quantity." });
            res.json({ message: "Quantity increased!", newQuantity, newTotalPrice });
        });
    });
});

app.put("/decrease-quantity/:menu", (req, res) => {
    const { menu } = req.params;

    // Check the current quantity
    const checkQuery = "SELECT quantity, price FROM cart WHERE menu = ?";
    db.query(checkQuery, [menu], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error." });

        if (results.length === 0) {
            return res.status(404).json({ error: "Item not found in cart." });
        }

        const { quantity, price } = results[0];

        if (quantity > 1) {
            // Decrease quantity and update total price
            const updateQuery = "UPDATE cart SET quantity = quantity - 1, total_price = total_price - ? WHERE menu = ?";
            db.query(updateQuery, [price, menu], (err) => {
                if (err) return res.status(500).json({ error: "Failed to update quantity." });
                res.json({ message: "Quantity decreased!" });
            });
        } else {
            // If quantity is 1, remove the item from cart
            const deleteQuery = "DELETE FROM cart WHERE menu = ?";
            db.query(deleteQuery, [menu], (err) => {
                if (err) return res.status(500).json({ error: "Failed to remove item from cart." });
                res.json({ message: "Item removed from cart!" });
            });
        }
    });
});


app.delete("/delete-from-cart/:menu", (req, res) => {
    const { menu } = req.params;

    if (!menu) {
        return res.status(400).json({ error: "Menu item is required" });
    }

    const deleteQuery = "DELETE FROM cart WHERE menu = ?";
    db.query(deleteQuery, [menu], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to delete item from cart" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Item not found in cart" });
        }

        res.json({ message: "Item deleted successfully!" });
    });
});

app.delete("/clear-cart", (req, res) => {
    const deleteQuery = "DELETE FROM cart";

    db.query(deleteQuery, (err, result) => {
        if (err) {
            console.error("Error clearing cart:", err);
            return res.status(500).json({ error: "Failed to clear cart" });
        }

        res.json({ message: "Cart cleared successfully!" });
    });
});


// Fetch Menu Items
app.get("/menu", (req, res) => {
    db.query("SELECT * FROM menu", (err, results) => {
      if (err) {
        console.error("Error fetching menu:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });
  
  // Fetch Details
  app.get("/details", (req, res) => {
    db.query("SELECT * FROM details", (err, results) => {
      if (err) {
        console.error("Error fetching details:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });
  
  app.delete("/delete-menu/:id", (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ error: "Menu ID is required" });
    }
  
    // Step 1: Delete related records in the details table
    const deleteDetailsQuery = "DELETE FROM details WHERE menu_fk = (SELECT menu FROM menu WHERE id = ?)";
    db.query(deleteDetailsQuery, [id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to delete related details" });
      }
  
      // Step 2: Delete the menu item
      const deleteMenuQuery = "DELETE FROM menu WHERE id = ?";
      db.query(deleteMenuQuery, [id], (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Failed to delete menu item" });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Menu item not found" });
        }
  
        res.json({ message: "Menu item and related details deleted successfully!" });
      });
    });
  });
  app.post("/add-menu", (req, res) => {
    try {
        const { id, menu, path } = req.body;

        // Validate request data
        if (!id || !menu || !path) {
            return res.status(400).json({ error: "ID, Menu name, and path are required!" });
        }

        // Insert into menu table
        const insertMenuQuery = `INSERT INTO menu (id, menu, path) VALUES (?, ?, ?)`;
        db.query(insertMenuQuery, [id, menu, path], (err, result) => {
            if (err) {
                console.error("Database Insert Error:", err.message);
                return res.status(500).json({ error: "Failed to add menu item. Try again!" });
            }

            // Insert into details table
            const insertDetailsQuery = `INSERT INTO details (menu_fk) VALUES (?)`;
            db.query(insertDetailsQuery, [menu], (err, result) => {
                if (err) {
                    console.error("Database Insert Error:", err.message);
                    return res.status(500).json({ error: "Failed to add details item. Try again!" });
                }

                console.log(`Menu Added: ID=${id}, Name=${menu}, Path=${path}`);
                res.status(201).json({ id, menu, path, message: "Menu and details added successfully!" });
            });
        });

    } catch (error) {
        console.error("Unexpected Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.delete("/delete-detail/:id", (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ error: "Detail ID is required" });
    }
  
    // Step 1: Get the menu_fk value from the details table
    const getMenuFkQuery = "SELECT menu_fk FROM details WHERE id = ?";
    db.query(getMenuFkQuery, [id], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to fetch detail record" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: "Detail record not found" });
      }
  
      const menuFk = results[0].menu_fk;
  
      // Step 2: Delete the record from the details table
      const deleteDetailQuery = "DELETE FROM details WHERE id = ?";
      db.query(deleteDetailQuery, [id], (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Failed to delete detail record" });
        }
  
        // Step 3: Delete the corresponding record from the menu table
        const deleteMenuQuery = "DELETE FROM menu WHERE menu = ?";
        db.query(deleteMenuQuery, [menuFk], (err, result) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to delete menu record" });
          }
  
          if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Menu record not found" });
          }
  
          res.json({ message: "Detail and corresponding menu record deleted successfully!" });
        });
      });
    });
  });
  
  app.put('/update-menu/:id', async (req, res) => {
    const { id } = req.params;
    const { menu, path } = req.body; // Assuming you want to update both menu and path
  
    try {
      if (!menu) {
        return res.status(400).json({ error: "Menu name is required" });
      }
  
      // Check if the menu ID exists
      const [existingMenu] = await db.execute(`SELECT * FROM menu WHERE id = ?`, [id]);
  
      if (existingMenu.length === 0) {
        return res.status(404).json({ error: "Menu item not found" });
      }
  
      // Update the menu table
      await db.execute(`UPDATE menu SET menu = ?, path = ? WHERE id = ?`, [menu, path, id]);
  
      res.json({ success: true, message: "Menu updated successfully" });
    } catch (error) {
      console.error("Error updating menu:", error);
      res.status(500).json({ error: error.message || "Failed to update menu" });
    }
  });
  
  app.put("/update-detail/:id", (req, res) => {
    const { id } = req.params;
    const { id: newId, menu_fk, price, review } = req.body;
  
    // Validate the new ID
    if (!newId) {
      return res.status(400).json({ error: "ID is required!" });
    }
  
    // Check if the new ID already exists in the details table
    const checkIdQuery = "SELECT * FROM details WHERE id = ?";
    db.query(checkIdQuery, [newId], (err, results) => {
      if (err) {
        console.error("Database Error:", err.message);
        return res.status(500).json({ error: "Database error. Try again!" });
      }
  
      if (results.length > 0 && newId !== id) {
        return res.status(400).json({ error: "ID already exists. Please use a unique ID." });
      }
  
      // Update the details table
      const updateQuery = `
        UPDATE details 
        SET id = ?, menu_fk = ?, price = ?, review = ? 
        WHERE id = ?`;
      db.query(updateQuery, [newId, menu_fk, price, review, id], (err, result) => {
        if (err) {
          console.error("Database Update Error:", err.message);
          return res.status(500).json({ error: "Failed to update detail. Try again!" });
        }
  
        res.json({ message: "Detail updated successfully!" });
      });
    });
  });
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
