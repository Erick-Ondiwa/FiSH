import React from "react";
import { motion } from "framer-motion";
import { Cloud, BarChart3, Bot, ShoppingCart, Users } from "lucide-react";

import Header from "../components/Header";
import Hero from "../sections/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <>
        <Header />
        <Hero />
        <Features />
        <Footer />

    </>
  );
};

export default LandingPage;
