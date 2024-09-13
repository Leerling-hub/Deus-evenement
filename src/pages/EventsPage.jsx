import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  SimpleGrid,
  Image,
  Text,
  Tag,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    categories: "",
    creator: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/events")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error("Fetched data is not an array:", data);
        }
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  const handleAddEvent = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    fetch("http://localhost:3000/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...newEvent,
        categories: newEvent.categories.split(",").map((cat) => cat.trim()),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setEvents((prevEvents) => [...prevEvents, data]);
        setShowModal(false);
      })
      .catch((error) => console.error("Error adding event:", error));
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Sport":
        return "green.200";
      case "Relaxation":
        return "yellow.200";
      case "Games":
        return "blue.200";
      case "Entertainment":
        return "pink.200";
      case "Culture":
        return "purple.200";
      default:
        return "gray.200";
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory
        ? Array.isArray(event.categories) &&
          event.categories.includes(selectedCategory)
        : true)
  );

  return (
    <Box p={4} bg="#d4f1c5">
      <Heading mb={4}>Deus evenementen</Heading>
      <Input
        placeholder="Zoek naar gebeurtenissen"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
      />
      <Select
        placeholder="Filter op categorie"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        mb={4}
      >
        <option value="Sport">Sport</option>
        <option value="Games">Games</option>
        <option value="Relaxation">Relaxation</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Culture">Culture</option>
      </Select>
      <Button onClick={handleAddEvent} mb={4}>
        Actie toevoegen
      </Button>
      <Modal isOpen={showModal} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nieuwe gebeurtenis toevoegen</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl></FormControl>
            <FormControl>
              <FormLabel>Titel</FormLabel>
              <Input
                name="title"
                value={newEvent.title}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Beschrijving</FormLabel>
              <Textarea
                name="description"
                value={newEvent.description}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Afbeelding URL</FormLabel>
              <Input
                name="image"
                value={newEvent.image}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Starttijd</FormLabel>
              <Input
                type="datetime-local"
                name="startTime"
                value={newEvent.startTime}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Eindtijd</FormLabel>
              <Input
                type="datetime-local"
                name="endTime"
                value={newEvent.endTime}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Categorieën</FormLabel>
              <Select
                name="categories"
                value={newEvent.categories}
                onChange={handleChange}
              >
                <option value="Sport">Sport</option>
                <option value="Games">Games</option>
                <option value="Relaxation">Relaxation</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Culture">Culture</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Toevoegen
            </Button>
            <Button onClick={handleCloseModal}>Annuleren</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <SimpleGrid columns={[1, 2, 4]} spacing={4}>
        {filteredEvents.map((event) => (
          <Box
            key={event.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg="white"
          >
            <Link to={`/event/${event.id}`}>
              <Image src={event.image} alt={event.title} />
              <Box p={4}>
                <VStack align="start">
                  <Tag bg={getCategoryColor(event.categories[0])} color="black">
                    {event.categories.join(", ")}
                  </Tag>
                  <Heading size="md">{event.title}</Heading>
                  <Text>{event.description}</Text>
                  <Text>
                    Start: {new Date(event.startTime).toLocaleString()}
                  </Text>
                  <Text>Einde: {new Date(event.endTime).toLocaleString()}</Text>
                </VStack>
              </Box>
            </Link>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default EventsPage;
