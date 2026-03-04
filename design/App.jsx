import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import ProductGrid from './components/ProductGrid';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import './styles.css';

function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <Hero />
        <CategoryGrid />
        <ProductGrid />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
