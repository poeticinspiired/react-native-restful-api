
/*
StAuth10244: I Abdi Sidnoor,000776285 certify that this material is my original work. 
No other person's work has been used without due acknowledgement. 
I have not made my work available to anyone else.
*/


import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";

// Backend API URL
const API_BASE_URL = "http://localhost:3001/api/";

export default function App() {
  const [items, setItems] = useState([]); // All cars
  const [newItem, setNewItem] = useState({
    make: "",
    model: "",
    year: "",
    kilometers: "",
  }); // New car to be added
  const [editingItem, setEditingItem] = useState(null); // Car being edited

  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch all cars
  const fetchItems = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setItems(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch items from the backend.");
    }
  };

  // Add a new car
  const handleAddItem = async () => {
    try {
      if (
        !newItem.make ||
        !newItem.model ||
        !newItem.year ||
        !newItem.kilometers
      ) {
        Alert.alert("Error", "All fields are required.");
        return;
      }
      await axios.post(API_BASE_URL, newItem);
      setNewItem({ make: "", model: "", year: "", kilometers: "" });
      fetchItems();
    } catch (error) {
      Alert.alert("Error", "Failed to add item.");
    }
  };

  // Delete a car by ID
  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}${id}`);
      fetchItems();
    } catch (error) {
      Alert.alert("Error", "Failed to delete item.");
    }
  };

  // Update a car
  const handleUpdateItem = async () => {
    try {
      if (
        !editingItem.make ||
        !editingItem.model ||
        !editingItem.year ||
        !editingItem.kilometers
      ) {
        Alert.alert("Error", "All fields are required.");
        return;
      }
      await axios.put(`${API_BASE_URL}${editingItem.id}`, editingItem);
      setEditingItem(null);
      fetchItems();
    } catch (error) {
      Alert.alert("Error", "Failed to update item.");
    }
  };

  // Delete all cars
  const handleClearCollection = async () => {
    try {
      await axios.delete(API_BASE_URL);
      fetchItems();
    } catch (error) {
      Alert.alert("Error", "Failed to clear collection.");
    }
  };

  // Replace collection
  const handleReplaceCollection = async () => {
    const newCollection = [
      { make: "Toyota", model: "Corolla", year: 2024, kilometers: 1000 },
      { make: "Ford", model: "F-150", year: 2022, kilometers: 5000 },
    ];
    try {
      await axios.put(API_BASE_URL, newCollection);
      fetchItems();
    } catch (error) {
      Alert.alert("Error", "Failed to replace collection.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Car Inventory Manager</Text>

      {/* Form to add/edit cars */}
      <View style={styles.form}>
        <TextInput
          placeholder="Make"
          value={editingItem ? editingItem.make : newItem.make}
          onChangeText={(text) =>
            editingItem
              ? setEditingItem({ ...editingItem, make: text })
              : setNewItem({ ...newItem, make: text })
          }
          style={styles.input}
        />
        <TextInput
          placeholder="Model"
          value={editingItem ? editingItem.model : newItem.model}
          onChangeText={(text) =>
            editingItem
              ? setEditingItem({ ...editingItem, model: text })
              : setNewItem({ ...newItem, model: text })
          }
          style={styles.input}
        />
        <TextInput
          placeholder="Year"
          value={editingItem ? editingItem.year : newItem.year}
          onChangeText={(text) =>
            editingItem
              ? setEditingItem({ ...editingItem, year: text })
              : setNewItem({ ...newItem, year: text })
          }
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Kilometers"
          value={editingItem ? editingItem.kilometers : newItem.kilometers}
          onChangeText={(text) =>
            editingItem
              ? setEditingItem({ ...editingItem, kilometers: text })
              : setNewItem({ ...newItem, kilometers: text })
          }
          style={styles.input}
          keyboardType="numeric"
        />
        <Button
          title={editingItem ? "Update Car" : "Add Car"}
          onPress={editingItem ? handleUpdateItem : handleAddItem}
        />
      </View>

      {/* Display list of cars */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>
              {item.make} {item.model} ({item.year}) - {item.kilometers} km
            </Text>
            <View style={styles.itemActions}>
              <TouchableOpacity
                onPress={() => setEditingItem(item)}
                style={styles.editButton}
              >
                <Text>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteItem(item.id)}
                style={styles.deleteButton}
              >
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Controls */}
      <View style={styles.controls}>
        <Button title="Clear All Cars" onPress={handleClearCollection} color="red" />
        <Button title="Replace Collection" onPress={handleReplaceCollection} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  item: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    padding: 10,
    backgroundColor: "yellow",
    borderRadius: 5,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  controls: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
