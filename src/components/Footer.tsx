import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Twitter, 
  Linkedin, 
  Facebook,
  Heart
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/50 mt-auto">
      <div className="max-w-7xl mx-auto">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-15 p-8 mt-6">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 bg-primary-foreground rounded-sm flex items-center justify-center">
                  <div className="w-3 h-3 bg-primary rounded-xs"></div>
                </div>
              </div>
              <span className="text-lg font-bold text-foreground">SmartApply.AI</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              AI-powered resume optimization and job application tracking platform. 
              Get hired faster with smart resume tailoring and interview preparation.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
<div className="bg-gradient-primary/10 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            
            <div className="grid grid-cols-2 gap-8 ">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1 ml-5">50+</div>
                <div className="text-sm text-muted-foreground ml-5">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1 ml-20">95%</div>
                <div className="text-sm text-muted-foreground ml-20">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1 ml-5">1k+</div>
                <div className="text-sm text-muted-foreground ml-5">Resumes Optimized</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1 ml-20">4.9★</div>
                <div className="text-sm text-muted-foreground ml-20">User Rating</div>
              </div>
            </div>
          </div>
        </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">amitkumarhzb75@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">+91 9334571861</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">Indore, Madhya Pradesh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Cookie Policy</a>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>© 2025 SmartApply.AI. All rights reserved.</span>
            </div>
          </div>
        </div>

        
      </div>
    </footer>
  );
};