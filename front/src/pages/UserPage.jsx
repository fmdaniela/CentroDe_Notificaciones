import React from "react";
import { Container } from "@mui/material";
import ContactForm from "../components/ContactForm";

export default function UserPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <ContactForm />
    </Container>
  );
}