import React, { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Input, Textarea } from "@chakra-ui/react";
import axios from "axios";

const AddTodoModal = ({ isOpen, onClose, onAddTodo }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddTodo = () => {
    // Perform validation here if needed

    // Create todo object
    const newTodo = {
      title
    };

    // Call API to add todo
    axios
      .post("https://kryzen-backend-p0vu.onrender.com/todos/create", newTodo, {
        headers: {
          auth: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log("Todo added successfully:", res.data);
        window.alert("Todo added successfully:")
        window.location.reload()
        // Clear input fields
        setTitle("");
        setDescription("");
        // Call the callback function passed from parent component to update state
        onAddTodo();
        // Close the modal
        onClose();
      })
      .catch((err) => {
        console.error("Error adding todo:", err);
        window.alert("Error adding todo")
        // Handle error here
      });
  };
  

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Todo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} mb={4} />
          {/* <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} /> */}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleAddTodo}>
            Add
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddTodoModal;