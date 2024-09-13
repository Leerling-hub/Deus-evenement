import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heading,
  Image,
  Text,
  Box,
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
  Tag,
  VStack,
  Link as ChakraLink,
} from "@chakra-ui/react";

const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [originalEvent, setOriginalEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/events/${eventId}`)
      .then((response) => response.json())
      .then((data) => {
        setEvent(data);
        setOriginalEvent(data);
      })
      .catch((error) => console.error("Error fetching event:", error));
  }, [eventId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedEvent = {
      ...event,
      categories: Array.isArray(event.categories)
        ? event.categories
        : event.categories.split(",").map((cat) => cat.trim()),
    };

    fetch(`http://localhost:3000/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEvent),
    })
      .then((response) => response.json())
      .then((data) => {
        setEvent(data);
        setOriginalEvent(data);
        setIsEditing(false);
        alert("Gebeurtenis succesvol bijgewerkt!");
        navigate("/");
      })
      .catch((error) => console.error("Error updating event:", error));
  };

  const handleDelete = () => {
    if (
      window.confirm("Weet je zeker dat je deze gebeurtenis wilt verwijderen?")
    ) {
      fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      })
        .then(() => {
          alert("Gebeurtenis succesvol verwijderd!");
          navigate("/");
        })
        .catch((error) => console.error("Error deleting event:", error));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setEvent({
      ...event,
      creator: "",
      imageCreator: "",
      title: "",
      description: "",
      image: "",
      startTime: "",
      endTime: "",
      categories: "",
    });
  };

  const handleCancel = () => {
    setEvent(originalEvent);
    setIsEditing(false);
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

  if (!event) {
    return <div>Bezig met laden...</div>;
  }

  return (
    <Box p={4} bg="##b68dfa">
      <Heading mb={4}>Evenement</Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        <Box
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          bg="white"
          p={4}
        >
          <Image src={event.image} alt={event.title} mb={4} />
          <VStack align="start" spacing={2}>
            <Tag bg={getCategoryColor(event.categories[0])} color="black">
              {Array.isArray(event.categories)
                ? event.categories.join(", ")
                : event.categories}
            </Tag>
            <Heading size="md">{event.title}</Heading>
            <Text>{event.description}</Text>
            <Text>Start: {new Date(event.startTime).toLocaleString()}</Text>
            <Text>Einde: {new Date(event.endTime).toLocaleString()}</Text>
            <Text>
              Gemaakt door: {event.creator || "Onbekende maker"}
              {event.imageCreator && (
                <ChakraLink
                  href={event.imageCreator}
                  isExternal
                  ml={2}
                  color="blue.500"
                >
                  (Afbeelding)
                </ChakraLink>
              )}
            </Text>
            <Button colorScheme="yellow" onClick={handleEdit}>
              Bewerken
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Verwijderen
            </Button>
          </VStack>
        </Box>
      </SimpleGrid>
      {isEditing && (
        <Modal isOpen={isEditing} onClose={handleCancel}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Gebeurtenis bewerken</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Gemaakt door</FormLabel>
                <Input
                  name="creator"
                  value={event.creator}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Afbeelding URL</FormLabel>
                <Input
                  name="imageCreator"
                  value={event.imageCreator}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Titel</FormLabel>
                <Input
                  name="title"
                  value={event.title}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Beschrijving</FormLabel>
                <Textarea
                  name="description"
                  value={event.description}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Afbeelding URL</FormLabel>
                <Input
                  name="image"
                  value={event.image}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Starttijd</FormLabel>
                <Input
                  type="datetime-local"
                  name="startTime"
                  value={event.startTime}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Eindtijd</FormLabel>
                <Input
                  type="datetime-local"
                  name="endTime"
                  value={event.endTime}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Filter op categorie</FormLabel>
                <Select
                  name="categories"
                  value={event.categories}
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
              <Button colorScheme="blue" mr={3} onClick={handleSave}>
                Opslaan
              </Button>
              <Button colorScheme="yellow" onClick={handleClear}>
                Leegmaken
              </Button>
              <Button onClick={handleCancel}>Annuleren</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default EventPage;
