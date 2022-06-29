import { Box } from "@mui/material";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./Login"

export const Unauthenticated = () => (
  <Box sx={{ display: "flex", backgroundColor: "#EEE" }}>
    <Routes>
      <Route path="/login" element={Login}></Route>
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  </Box>
)
