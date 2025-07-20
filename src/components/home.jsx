import { useEffect, useState } from 'react';
import './home.css';
import Navbarr from './navbar'; // Assuming Navbarr is the navbar component
import SchemaBuilder from './schema';

export default function Home() {
  const [text, setText] = useState('');
  const fullText =
    "Welcome to JSON Schema Maker!\n\nYour one-stop solution to effortlessly create, copy, save, and preview JSON schemas. Design your schema visually, see instant previews, copy with a click, and save your work for the future—simple, powerful, and free for all!";

      const welcomePart = "Welcome to JSON Schema Maker!";

 useEffect(() => {
  let index = 0;
  const interval = setInterval(() => {
    if (index >= fullText.length) {
      clearInterval(interval);
      return;
    }
    setText(prev => prev + fullText.charAt(index));
    index++;
  }, 38);
  return () => clearInterval(interval);
}, []);

const welcomeLength = welcomePart.length;





  return (
   <div className="home-container">
  {/* <div className="navbar-wrapper">
    <Navbarr />
  </div> */}
  <div className="tt">
    <h1 className="typewriter-text">
      <span className="welcome-font">
            {text.substring(0, welcomeLength)}
          </span>
          {text.substring(welcomeLength)}
      <span className="blinking-cursor">|</span>
    </h1>
  </div>
    {/* <div className="schema-wrapper">
  <SchemaBuilder />
  </div> */}
</div>

  );
}
