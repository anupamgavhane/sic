import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import { Users, Zap, Shield, ArrowRight, Car, UtensilsCrossed, ShoppingCart, MessageCircle } from 'lucide-react';

const Landing = () => {
  return (
    <AnimatedBackground>
      {/* Navbar */}
      <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-[#D2FF28] to-[#D6F599] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-[#420217] font-extrabold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-white">SharingIsCaring</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-medium text-white/70 hover:text-white transition-all duration-300"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 text-sm font-bold bg-[#D2FF28] text-[#420217] rounded-xl hover:scale-105 hover:shadow-xl hover:bg-[#D6F599] transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 page-enter">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 mb-6 text-sm text-[#D6F599]">
            <Zap size={14} className="text-[#D2FF28]" />
            Built for IIIT Nagpur students
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Share Rides.
            <br />
            <span className="bg-gradient-to-r from-[#D2FF28] via-[#D6F599] to-[#C84C09] bg-clip-text text-transparent">
              Split Bills.
            </span>
            <br />
            Save Together.
          </h1>
          
          <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto leading-relaxed">
            Create temporary rooms to split rides, food orders, and purchases with your batchmates. Real-time chat. Auto-expiring rooms. Zero hassle.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="group flex items-center justify-center gap-2 px-8 py-3.5 bg-[#D2FF28] text-[#420217] font-bold rounded-2xl hover:scale-105 hover:shadow-2xl hover:bg-[#D6F599] transition-all duration-300 text-base"
            >
              Start Sharing
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-sm border border-white/15 text-white font-semibold rounded-2xl hover:bg-white/15 transition-all duration-300"
            >
              I have an account
            </Link>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { Icon: Car, label: 'Cab Sharing', desc: 'Split Uber/Ola rides to airport or station', color: 'bg-[#436436] text-[#D6F599]' },
            { Icon: UtensilsCrossed, label: 'Food Orders', desc: 'Group orders for Swiggy, Zomato or canteen', color: 'bg-[#C84C09] text-white' },
            { Icon: ShoppingCart, label: 'E-commerce', desc: 'Split bulk Amazon or Flipkart orders', color: 'bg-[#420217] text-[#D2FF28]' },
            { Icon: MessageCircle, label: 'Real-time Chat', desc: 'Coordinate instantly with room members', color: 'bg-[#D6F599] text-[#420217]' },
          ].map(({ Icon, label, desc, color }, i) => (
            <div
              key={label}
              className="card-enter bg-white/8 backdrop-blur-lg rounded-2xl p-6 border border-white/15 hover:bg-white/12 hover:scale-[1.03] transition-all duration-300 group"
              style={{ animationDelay: `${i * 100 + 200}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300 ${color}`}>
                <Icon size={22} className="currentColor" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">{label}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Create a Room', desc: 'Choose a category, set max members and expiry time.' },
            { step: '02', title: 'Invite & Join', desc: 'Share the room link or let others discover and join.' },
            { step: '03', title: 'Chat & Coordinate', desc: 'Plan the details in real-time. Room auto-expires when done.' },
          ].map(({ step, title, desc }, i) => (
            <div
              key={step}
              className="card-enter text-center"
              style={{ animationDelay: `${i * 120 + 400}ms` }}
            >
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#D2FF28] font-bold text-lg">
                {step}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/15 p-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to start saving?</h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Join your batchmates on SharingIsCaring and stop overpaying for rides and food.
          </p>
          <Link
            to="/register"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-[#D2FF28] text-[#420217] font-bold rounded-2xl hover:scale-105 hover:shadow-2xl hover:bg-[#D6F599] transition-all duration-300 text-base"
          >
            Create Free Account
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#436436] rounded-lg flex items-center justify-center">
              <span className="text-[#D6F599] font-extrabold text-xs">S</span>
            </div>
            <span className="text-white/50 text-sm">SharingIsCaring © 2026</span>
          </div>
          <p className="text-white/30 text-xs">Made with ❤️ at IIIT Nagpur</p>
        </div>
      </footer>
    </AnimatedBackground>
  );
};

export default Landing;
