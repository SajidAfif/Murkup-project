import React from 'react'
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg"></div>
              <span className="text-xl font-bold">To-LET</span>
            </div>
            <p className="text-gray-400 text-sm">
              Making it easy to find your perfect rental property
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/" className="hover:text-primary-400">Browse Properties</Link>
              </li>
              <li>
                <Link to="/list-property" className="hover:text-primary-400">Post Property</Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-primary-400">FAQ</Link>
              </li>
              <li>
                <a href="mailto:info@tolet.com" className="hover:text-primary-400">Contact</a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="mailto:info@tolet.com?subject=Help%20Center" className="hover:text-primary-400">Help Center</a>
              </li>
              <li>
                <a href="mailto:info@tolet.com?subject=Safety%20Tips" className="hover:text-primary-400">Safety Tips</a>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary-400">Terms &amp; Conditions</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary-400">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-primary-400" />
                <a href="tel:+8801XXXXXXXX" className="hover:text-primary-400">+880 1XXX-XXXXXX</a>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-primary-400" />
                <a href="mailto:info@tolet.com" className="hover:text-primary-400">info@tolet.com</a>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 text-primary-400 mt-1 flex-shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">&copy; 2024 To-LET. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/toletbd" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/toletbd" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/company/tolet" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
