import React from "react";
import { motion } from "framer-motion";
import { Cloud, BarChart3, Bot, ShoppingCart, Users } from "lucide-react";

import Header from "../components/landingPage/Header";
import Hero from "../components/landingPage/Hero";
import Features from "../components/landingPage/Features";
import Footer from "../components/landingPage/Footer";

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
