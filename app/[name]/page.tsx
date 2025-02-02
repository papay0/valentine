"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Confetti from "react-confetti";
import { useParams } from "next/navigation";

export default function ValentinePage() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const params = useParams();
  const name = decodeURIComponent(params.name as string);
  // Capitalize first letter of each word
  const displayName = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const lastMoveTime = useRef(Date.now());
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const isMovingRef = useRef(false);
  const hasReachedButtonRef = useRef(false);

  const getNoButtonText = () => {
    const phrases = [
      "No",
      "Are you sure?",
      "Really sure?",
      "Think again!",
      "Last chance!",
      "Surely not?",
      "You might regret this!",
      "Give it another thought!",
      "Are you absolutely sure?",
      "This could be a mistake!",
      "Have a heart!",
      "Don't be so cold!",
      "Change of heart?",
      "Wouldn't you reconsider?",
      "Is that your final answer?",
      "You're breaking my heart ;(",
      "I'm gonna cry...",
      "Don't do this to me!",
      "Pretty please?",
      "But we're perfect together!",
      "Just give it a chance!",
      "My heart is aching!",
      "You can't mean that!",
      "But I love you!",
      "Don't leave me hanging!",
      "Is there someone else?",
      "I can change!",
      "What about our future?",
      "Think of the memories!",
      "We could be so good!",
      "I'm on my knees!",
      "Not like this!",
      "You're making a mistake!",
      "I'll learn to cook!",
      "I'll do anything!",
      "Just say yes!",
      "Give love a chance!",
      "Don't crush my dreams!",
      "But we're soulmates!",
      "I'm your best option!",
      "Think about it more!",
      "You'll regret this!",
      "I'm perfect for you!",
      "Just one chance!",
      "Please reconsider!",
      "I'm begging you!",
      "Don't be like this!",
      "My heart can't take it!",
      "You're too precious!",
      "We're meant to be!",
      "Don't break my heart!",
      "I'll write you poems!",
      "I'll sing for you!",
      "I'll dance for you!",
      "I'll give you chocolate!",
      "I'll buy you flowers!",
      "I'll be better!",
      "Just think again!",
      "You're making me sad!",
      "I'm losing hope!",
      "Don't crush my soul!",
      "I'm dying inside!",
      "Give me a sign!",
      "I'll never give up!",
      "You're my everything!",
      "My heart is yours!",
      "I'm yours forever!",
      "Don't do this to us!",
      "Think of our love!",
      "I'll be perfect!",
      "Just one yes!",
      "I'm heartbroken!",
      "You're too special!",
      "I need you!",
      "Don't say no again!",
      "I'm getting desperate!",
      "Please say yes!",
      "I'll do better!",
      "One more chance!",
      "Don't leave me!",
      "I'm not giving up!",
      "You're the one!",
      "We're perfect!",
      "Just try it out!",
      "Give us a shot!",
      "I'll prove it!",
      "Trust in love!",
      "Believe in us!",
      "Don't deny love!",
      "Feel the romance!",
      "Open your heart!",
      "Love conquers all!",
      "Take a leap!",
      "Follow your heart!",
      "destiny awaits!",
      "Fate brought us here!",
      "It's meant to be!",
      "Written in the stars!",
      "Love at first sight!",
      "Our time is now!",
      "Forever yours!",
      "My final plea!",
      "Last chance at love!",
      "Don't let go!",
      "Hold onto love!",
      "Love wins always!",
      "Together forever?",
      "Please please please!",
      "I'm running out of phrases!",
      "This is exhausting...",
      "Still not giving up!",
      "Getting really tired...",
      "But I practiced so much!",
    ];
    return phrases[Math.min(noCount, phrases.length - 1)];
  };

  // Calculate the distance between two points
  const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  // Get a position that's definitely far from the mouse
  const getFarPosition = (mouseX: number, mouseY: number, containerRect: DOMRect) => {
    if (!noButtonRef.current) return { x: 0, y: 0 };

    const button = noButtonRef.current;
    const buttonWidth = button.offsetWidth;
    const buttonHeight = button.offsetHeight;
    const padding = 40;
    const safeZone = 150; // Minimum distance from mouse

    // Try several positions and pick the farthest one
    let bestPosition = { x: 0, y: 0 };
    let maxDistance = 0;

    // Try more positions for better evasion
    for (let i = 0; i < 15; i++) {
      let testX, testY;
      
      if (i < 4) { // Try corners
        testX = i % 2 === 0 ? padding : containerRect.width - buttonWidth - padding;
        testY = i < 2 ? padding : containerRect.height - buttonHeight - padding;
      } else { // Try random positions across the entire container
        testX = Math.random() * (containerRect.width - buttonWidth - 2 * padding) + padding;
        testY = Math.random() * (containerRect.height - buttonHeight - 2 * padding) + padding;
      }

      const distance = getDistance(mouseX, mouseY, testX + buttonWidth / 2, testY + buttonHeight / 2);
      
      if (distance > maxDistance && distance > safeZone) {
        maxDistance = distance;
        bestPosition = { x: testX, y: testY };
      }
    }

    // If we couldn't find a position far enough, use the opposite corner with extra distance
    if (maxDistance < safeZone) {
      bestPosition = {
        x: mouseX < containerRect.width / 2 ? 
          containerRect.width - buttonWidth - padding : padding,
        y: mouseY < containerRect.height / 2 ? 
          containerRect.height - buttonHeight - padding : padding
      };
    }

    return bestPosition;
  };

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (buttonContainerRef.current) {
        const containerRect = buttonContainerRef.current.getBoundingClientRect();
        mousePositionRef.current = {
          x: e.clientX - containerRect.left,
          y: e.clientY - containerRect.top
        };
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  useEffect(() => {
    const checkMouseProximity = () => {
      if (!buttonContainerRef.current || !noButtonRef.current || isMovingRef.current) return;

      const containerRect = buttonContainerRef.current.getBoundingClientRect();
      const button = noButtonRef.current;
      const mouseX = mousePositionRef.current.x;
      const mouseY = mousePositionRef.current.y;

      // Calculate distance from mouse to button center
      const buttonCenterX = position.x + button.offsetWidth / 2;
      const buttonCenterY = position.y + button.offsetHeight / 2;
      const distance = getDistance(mouseX, mouseY, buttonCenterX, buttonCenterY);

      // If mouse is too close, move the button
      if (distance < 100) {
        hasReachedButtonRef.current = true;
        isMovingRef.current = true;
        const newPos = getFarPosition(mouseX, mouseY, containerRect);
        setPosition(newPos);
        
        // Only update text if we've actually gotten close to the button
        if (hasReachedButtonRef.current) {
          const now = Date.now();
          if (now - lastMoveTime.current > 400) {
            setNoCount(prev => prev + 1);
            lastMoveTime.current = now;
          }
        }
        
        setTimeout(() => {
          isMovingRef.current = false;
        }, 100);
      }
    };

    const intervalId = setInterval(checkMouseProximity, 30);
    return () => clearInterval(intervalId);
  }, [position]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-pink-100 relative">
      {yesPressed && (
        <>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={1000}
          />
        </>
      )}
      <Card className="w-[90%] max-w-[600px] bg-white/80 backdrop-blur-sm">
        <CardContent 
          ref={buttonContainerRef}
          className="flex flex-col items-center gap-7 p-8 relative min-h-[400px]"
        >
          <h1 className="text-4xl font-bold text-gray-800 text-center">
            {yesPressed ? "Yay!! 🎉💖" : `Hey ${displayName}, will you be my Valentine?`}
          </h1>
          {yesPressed ? (
            <div className="text-center">
              <p className="text-xl mb-4">I knew you would say yes! 🥰</p>
              <div className="grid grid-cols-3 gap-4">
                {["💝", "💘", "💖", "💗", "💓", "💞"].map((heart, idx) => (
                  <span
                    key={idx}
                    className="text-4xl animate-bounce"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    {heart}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <>
              <img
                src="https://gifdb.com/images/high/cute-love-bear-roses-ou7zho5oosxnpo6k.gif"
                alt="Cute bear with hearts"
                className="w-[200px] h-[200px] rounded-lg"
              />
              <Button
                variant="default"
                className="bg-green-500 hover:bg-green-600 text-white text-xl h-12 px-8 z-10"
                onClick={() => setYesPressed(true)}
              >
                Yes 🥰
              </Button>
              <Button
                ref={noButtonRef}
                variant="default"
                className="bg-red-500 hover:bg-red-600 text-white text-xl h-12 px-8 absolute"
                style={{
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                  transition: "all 0.08s ease",
                  transform: `scale(${noCount > 0 ? 0.95 : 1})`,
                }}
              >
                {getNoButtonText()} 😢
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      <footer className="fixed bottom-4 text-sm text-gray-600/80 font-light">
        Made with 💝 in San Francisco by{" "}
        <a 
          href="https://www.linkedin.com/in/arthur-papailhau/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-500 transition-colors underline decoration-dotted"
        >
          Arthur Papailhau
        </a>
      </footer>
    </div>
  );
} 