import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, useMediaQuery } from "@chakra-ui/react";
import EventsPage from "./pages/EventsPage";
import EventPage from "./pages/EventPage";

const App = () => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  return (
    <Router>
      <Box display={isLargerThan768 ? "flex" : "block"}>
        <Box flex="1" p={4}>
          <Routes>
            <Route path="/" element={<EventsPage />} />
            <Route path="/event/:eventId" element={<EventPage />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default App;
