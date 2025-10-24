import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/Navigation";
import "../../styles/admin/admin.css";

export default function Admin() {
  const [menu, setMenu] = useState([]);
  const [details, setDetails] = useState([]);
  const [activeTable, setActiveTable] = useState("menu");
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [newId, setNewId] = useState(""); 
  const [newMenu, setNewMenu] = useState("");
  const [newPath, setNewPath] = useState("");

  
  const fetchMenu = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/menu`);

      const data = await response.json();
      setMenu(data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

 
  const fetchDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/details`);

      const data = await response.json();
      setDetails(data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  useEffect(() => {
    fetchMenu();
    fetchDetails();
  }, []);


  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditedData({ ...item });
  };

  const handleChange = (e, field) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };

  const handleUpdate = async (id, type) => {
    try {
      const response = await fetch(`http://localhost:7000/update-${type}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Update failed");
      }

      setEditingId(null);
      setEditedData({});
      fetchDetails();
    } catch (error) {
      console.error("Error updating:", error.message);
    }
  };

  const handleDelete = async (id, type) => {
    try {
      const endpoint = type === "menu" ? "delete-menu" : "delete-detail";
      console.log(`Deleting ${type} with ID: ${id}`);
  
      const response = await fetch(`http://localhost:7000/${endpoint}/${id}`, { method: "DELETE" });
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Delete failed");
      }
  
      console.log(`Delete successful:`, result);
  

      if (type === "menu") {
        fetchMenu(); 
      } else {
        fetchDetails();
      }
    } catch (error) {
      console.error("Error deleting:", error.message);
      alert(`Failed to delete: ${error.message}`);
    }
  };
  const handleAddMenu = async () => {
    if (!newId.trim() || !newMenu.trim() || !newPath.trim()) {
        alert("Menu ID, Name, and Path cannot be empty!");
        return;
    }

    try {
        const response = await fetch("http://localhost:7000/add-menu", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: newId,
                menu: newMenu,
                path: newPath,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Menu and details added successfully!");
            setNewId("");
            setNewMenu("");
            setNewPath("");
            fetchMenu();
            fetchDetails(); 
        } else {
            alert(`Same id given or the item is repeated`);
        }
    } catch (error) {
        console.error("Error adding menu:", error);
        alert("An error occurred while adding the menu.");
    }
};
  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-container">

        <div className="table-buttons">
          <button onClick={() => setActiveTable("menu")}>Menu Table</button>
          <button onClick={() => setActiveTable("details")}>Details Table</button>
        </div>

        {activeTable === "menu" && (
          <>
            <h2>Menu Table</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Menu Item</th>
                  <th>Path</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {menu.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.menu}</td>
                    <td>{item.path}</td>
                    <td>
                      <button onClick={() => handleDelete(item.id, "menu")}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="add-menu">
              <input
                type="text"
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                placeholder="Enter ID"
              />
              <input
                type="text"
                value={newMenu}
                onChange={(e) => setNewMenu(e.target.value)}
                placeholder="Enter Menu Name"
              />
              <input
                type="text"
                value={newPath}
                onChange={(e) => setNewPath(e.target.value)}
                placeholder="Enter Path"
              />
              <button onClick={handleAddMenu}>Add</button>
            </div>
          </>
        )}

        {activeTable === "details" && (
          <>
            <h2>Details Table</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Review</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
              {details.map((detail) => (
                <tr key={detail.id}>
                <td>
                  {editingId === detail.id ? (
                  <input
                    type="text"
                    value={editedData.id || ""}
                    onChange={(e) => handleChange(e, "id")}
                  />
                  ) : ( detail.id)}
                </td>
                <td>
                  {editingId === detail.id ? (
                  <input
                    type="text"
                    value={editedData.menu_fk || ""}
                    onChange={(e) => handleChange(e, "menu_fk")}
                  />
                  ) : (detail.menu_fk)}
                </td>
                <td>
                  {editingId === detail.id ? (
                  <input
                    type="text"
                    value={editedData.price || ""}
                    onChange={(e) => handleChange(e, "price")}
                  />
                  ) : (detail.price)}
                </td>
                <td>
                  {editingId === detail.id ? (
                  <input
                    type="text"
                    value={editedData.review || ""}
                    onChange={(e) => handleChange(e, "review")}
                  />
                  ) : (detail.review)}
                  </td>
                  <td>
                    {editingId === detail.id ? (
                    <>
                      <button onClick={() => handleUpdate(detail.id, "detail")}>Save</button>
                      <button onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(detail)}>Edit</button>
                      <button onClick={() => handleDelete(detail.id, "detail")}>Delete</button>
                    </>
              )}
    </td>
  </tr>
))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
