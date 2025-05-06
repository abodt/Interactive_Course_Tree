import React from "react";
import { FaFacebook, FaInstagram, FaSnapchatGhost } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // منصة X (تويتر سابقًا)
import './SocialIcons.css';
const SocialIcons = () => {
  return (
    <div  >
      <a href="https://www.facebook.com"  className="facebook  "  target="_blank" rel="noopener noreferrer">
        <FaFacebook />
      </a>
      <a href="https://www.instagram.com"  className="instagram " target="_blank" rel="noopener noreferrer">
        <FaInstagram />
      </a>
      <a href="https://www.snapchat.com"  className="snapchat "  target="_blank" rel="noopener noreferrer">
        <FaSnapchatGhost />
      </a>
      <a href="https://twitter.com"  className="x  "  target="_blank" rel="noopener noreferrer">
        <FaXTwitter />
      </a>
    </div>
  );
};

export default SocialIcons;