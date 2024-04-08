import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Flex, Box, Heading, Text, Button } from "@chakra-ui/react";
import Header from "../components/Header";
import axios from "axios";
import AddTodoModal from "../components/newTodo";

const KanbanBoard = () => {
  const [data, setData] = useState(null); // Initialize data as null
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("https://kryzen-backend-p0vu.onrender.com/todos", {
        headers: {
          auth: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data);
        const transformedData = transformData(res.data);
        setData(transformedData); // Set the transformed data to state
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  };

  const transformData = (todos) => {
    const columns = {
      "column-1": {
        id: "column-1",
        title: "In Progress",
        value: "in-progress",
        cardIds: [],
      },
      "column-2": {
        id: "column-2",
        title: "Rework",
        value: "rework",
        cardIds: [],
      },
      "column-3": {
        id: "column-3",
        title: "Done",
        value: "done",
        cardIds: [],
      },
    };

    const cards = {};

    todos.forEach((todo, index) => {
      const cardId = `card-${index + 1}`;
      const columnId = getColumnIdByStatus(todo.status); // Get the column ID based on the todo status
      columns[columnId].cardIds.push(cardId); // Add card ID to the appropriate column
      cards[cardId] = { id: todo._id, content: todo.title, date: todo.date }; // Use _id from the backend response
    });

    return { columns, cards };
  };

  // Helper function to get column ID based on todo status
  const getColumnIdByStatus = (status) => {
    switch (status) {
      case "in-progress":
        return "column-1";
      case "rework":
        return "column-2";
      case "done":
        return "column-3";
      default:
        return "column-1"; // Default to "In Progress" if status is not recognized
    }
  };

  const handleTaskStatusUpdate = async(cardId, newStatus) => {
    axios
      .put(
        `https://kryzen-backend-p0vu.onrender.com/todos/${cardId}`,
        {
          status: newStatus,
        },
        {
          headers: {
            auth: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        // Handle successful response
        console.log("Task status updated successfully on the backend");
      })
      .catch((err) => {
        // Handle error
        console.error("Error updating task status:", err);
      });
  };

  const onDragEnd = async(result) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or the item is dropped back into its original position
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const startColumn = data.columns[source.droppableId];
    const endColumn = data.columns[destination.droppableId];

    // Moving within the same column
    if (startColumn === endColumn) {
      const newCardIds = Array.from(startColumn.cardIds);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        cardIds: newCardIds,
      };

      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newData);
      return;
    }

    // Moving between columns
    const startCardIds = Array.from(startColumn.cardIds);
    startCardIds.splice(source.index, 1);
    const newStartColumn = {
      ...startColumn,
      cardIds: startCardIds,
    };

    const endCardIds = Array.from(endColumn.cardIds);
    endCardIds.splice(destination.index, 0, draggableId);
    const newEndColumn = {
      ...endColumn,
      cardIds: endCardIds,
    };

    // Update the status of the card based on the destination column
    const updatedCard = {
      ...data.cards[draggableId],
      status: endColumn.value,
    };

    handleTaskStatusUpdate(updatedCard.id, endColumn.value);

    const newData = {
      ...data,
      columns: {
        ...data.columns,
        [newStartColumn.id]: newStartColumn,
        [newEndColumn.id]: newEndColumn,
      },
      cards: {
        ...data.cards,
        [draggableId]: updatedCard,
      },
    };

    setData(newData);
  };

  if (!data) {
    return <div>Loading...</div>; // Render loading state until data is fetched
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };
  const handleDeleteTodo = async(todoId) => {
    // Make an HTTP DELETE request to delete the todo item
    axios
      .delete(`https://kryzen-backend-p0vu.onrender.com/todos/${todoId}`, {
        headers: {
          auth: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log("Todo deleted successfully:", res.data);
        // Remove the deleted todo item from the state
        const newData = { ...data };
        Object.keys(newData.columns).forEach((columnId) => {
          const column = newData.columns[columnId];
          const cardIndex = column.cardIds.findIndex(
            (cardId) => data.cards[cardId].id === todoId
          );
          if (cardIndex !== -1) {
            column.cardIds.splice(cardIndex, 1);
          }
        });
        delete newData.cards[`card-${todoId}`];
        setData(newData);
      })
      .catch((err) => {
        console.error("Error deleting todo:", err);
        // Handle error
      });
  };

  return (
    <>
      <Header />
      <Button
        onClick={openAddModal}
        position={"relative"}
        left={-590}
        colorScheme="blue"
        mb={5}
        mt={5}
      >
        Add Todo
      </Button>
      <AddTodoModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAddTodo={fetchData}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Flex
          justifyContent="space-around"
          alignItems="flex-start"
          flexWrap="wrap"
        >
          {Object.values(data.columns).map((column) => (
            <Box
              key={column.id}
              p={4}
              width="300px"
              bg="white"
              borderRadius="lg"
              boxShadow="md"
              mb={4}
            >
              <Heading size="md" mb={4} textAlign="center" color="gray.800">
                {column.title}
              </Heading>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    bg={
                      column.title === "In Progress"
                        ? "blue.100"
                        : column.title === "Rework"
                        ? "red.100"
                        : "green.100"
                    }
                    p={4}
                    borderRadius="md"
                    minHeight="200px"
                  >
                    {column.cardIds.map((cardId, index) => {
                      const card = data.cards[cardId];
                      return (
                        <Draggable
                          key={cardId}
                          draggableId={cardId}
                          index={index}
                        >
                          {(provided) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              bg="white"
                              p={4}
                              mb={4}
                              borderRadius="md"
                              boxShadow="sm"
                              _hover={{ boxShadow: "md" }}
                            >
                              <Text mb={2} color="gray.800">
                                {card.content}
                              </Text>
                              <Text fontSize="sm" color="gray.500">
                                Status: {column.value} | Date:{" "}
                                {formatDate(card.date)}
                              </Text>
                              <Button
                                onClick={() => handleDeleteTodo(card.id)}
                                colorScheme="red"
                                size="sm"
                                mt={2}
                              >
                                Delete
                              </Button>
                            </Box>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          ))}
        </Flex>
      </DragDropContext>
    </>
  );
};

export default KanbanBoard;
