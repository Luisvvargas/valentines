import { Heart } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const raveStyles = `
@keyframes backgroundRave {
  0% { background-color: rgba(128, 0, 128, 0.8); }
  20% { background-color: rgba(0, 0, 255, 0.8); }
  40% { background-color: rgba(0, 77, 0, 0.8); }
  60% { background-color: rgba(255, 105, 180, 0.8); }
  80% { background-color: rgba(255, 0, 0, 0.8); }
  100% { background-color: rgba(255, 255, 255, 0.8); }
}

.text-stroke {
  -webkit-text-stroke: 2px black;
  text-stroke: 2px black;
  text-shadow: 2px 2px 0 #000,
              -2px -2px 0 #000,
              2px -2px 0 #000,
              -2px 2px 0 #000,
              0 2px 0 #000,
              2px 0 0 #000,
              0 -2px 0 #000,
              -2px 0 0 #000;
}`;

const questions = [
  {
    id: 1,
    question: "¿Cual es el nombre real de 'titi'?",
    image: "/images/TITI.png",
    options: ["McDonald's", "Luisa", "Tito", "Gurru"],
    correctAnswer: 1,
    correctSound: "/audio/1oia.mp3"
  },
  {
    id: 2,
    question: "¿Cual es 'nuestra' pelicula?",
    image: "/images/ambosbbcines.jpeg",
    options: ["Cindy la regia", "The Notebook", "La La Land", "Nugget de carl's"],
    correctAnswer: 2,
    correctSound: "/audio/1oia.mp3"
  },
  {
    id: 3,
    question: "¿Cual es nuestro snack favorito?",
    image: "/images/lunchsnack.jpeg",
    options: ["Elotines", "Palomitas takis", "Raspado", "Turron"],
    correctAnswer: 0,
    correctSound: "/audio/1oia.mp3"
  },
  {
    id: 4,
    question: "¿Cuando es nuestro aniversario?",
    image: "/images/bibble.jpg",
    options: ["3 Dic", "3 Nov", "30 Mar", "Todos los años"],
    correctAnswer: 0,
    correctSound: "/audio/2oia.mp3"
  },
  {
    id: 5,
    question: "¿Cual es nuestra comida fav?",
    image: "/images/pizzaBBCIN.jpeg",
    options: ["BIRRRIAAAAA", "Pizza", "Cochinero", "Nugget"],
    correctAnswer: 0,
    correctSound: "/audio/2oia.mp3"
  }
];

const createBouncingImage = (id) => ({
  id,
  position: { 
    x: Math.random() * (window.innerWidth - 200), 
    y: Math.random() * (window.innerHeight - 200) 
  },
  speed: { 
    x: Math.random() * 6 + 4, // Velocidad entre 4 y 10
    y: Math.random() * 6 + 4
  },
  direction: { 
    x: Math.random() > 0.5 ? 1 : -1, 
    y: Math.random() > 0.5 ? 1 : -1 
  }
});

const ValentineApp = () => {
  const [gameState, setGameState] = useState('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [noButtonPosition, setNoButtonPosition] = useState({ top: '50%', left: '50%' });
  const [bouncingImages, setBouncingImages] = useState([createBouncingImage(0)]);
  
  const audioRef = useRef(null);
  const startAudioRef = useRef(null);
  const correctAudioRefs = useRef(questions.map(() => React.createRef()));
  const animationRef = useRef();

  const animate = () => {
    setBouncingImages(currentImages => {
      return currentImages.map(img => {
        let newX = img.position.x + img.speed.x * img.direction.x;
        let newY = img.position.y + img.speed.y * img.direction.y;
        let newDirectionX = img.direction.x;
        let newDirectionY = img.direction.y;

        if (newX < 0 || newX > window.innerWidth - 200) {
          newDirectionX *= -1;
          newX = newX < 0 ? 0 : window.innerWidth - 200;
        }
        if (newY < 0 || newY > window.innerHeight - 200) {
          newDirectionY *= -1;
          newY = newY < 0 ? 0 : window.innerHeight - 200;
        }

        return {
          ...img,
          position: { x: newX, y: newY },
          direction: { x: newDirectionX, y: newDirectionY }
        };
      });
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (gameState === 'accepted') {
      const maxImages = 5;
      let currentCount = 1;

      const addImageInterval = setInterval(() => {
        if (currentCount < maxImages) {
          setBouncingImages(current => [...current, createBouncingImage(currentCount)]);
          currentCount++;
        } else {
          clearInterval(addImageInterval);
        }
      }, 1000);

      return () => clearInterval(addImageInterval);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'accepted') {
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState]);

  const handleStart = () => {
    setGameState('playing');
    if (startAudioRef.current) {
      startAudioRef.current.volume = 0.7;
      startAudioRef.current.play().catch(e => console.log("Error reproduciendo audio:", e));
    }
  };

  const handleAnswer = (selectedIndex) => {
    if (selectedIndex === questions[currentQuestion].correctAnswer) {
      const audioElement = correctAudioRefs.current[currentQuestion].current;
      if (audioElement) {
        audioElement.currentTime = 0;
        audioElement.volume = 0.7;
        audioElement.play().catch(e => console.log("Error reproduciendo audio:", e));
      }

      if (currentQuestion === questions.length - 1) {
        setGameState('proposal');
      } else {
        setCurrentQuestion(prev => prev + 1);
      }
    } else {
      const errorMessage = document.getElementById('errorMessage');
      errorMessage.style.display = 'block';
      setTimeout(() => {
        errorMessage.style.display = 'none';
      }, 1500);
    }
  };

  const moveNoButton = () => {
    const newTop = Math.random() * 80 + 10;
    const newLeft = Math.random() * 80 + 10;
    setNoButtonPosition({ top: `${newTop}%`, left: `${newLeft}%` });
  };

  const handleAccept = () => {
    setGameState('accepted');
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.volume = 0.7;
        audioRef.current.play().catch(e => console.log("Error reproduciendo audio:", e));
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-pink-100 p-4 flex flex-col items-center justify-center">
      <style>{raveStyles}</style>
      
      {/* Audios ocultos */}
      <audio
        ref={startAudioRef}
        src="/audio/1oia.mp3"
        className="hidden"
      />
      {questions.map((question, index) => (
        <audio
          key={index}
          ref={correctAudioRefs.current[index]}
          src={question.correctSound}
          className="hidden"
        />
      ))}
      <audio
        ref={audioRef}
        src="/audio/endoia.mp3"
        className="hidden"
      />

      {/* Pantalla de inicio */}
      {gameState === 'start' && (
        <div className="text-center">
          <Heart className="w-20 h-20 text-red-500 mx-auto" />
          <h1 className="text-3xl font-bold text-red-600 mt-4 mb-8">
            ¡Hola Bbcina! 💖
          </h1>
          <button
            onClick={handleStart}
            className="bg-red-500 text-white px-8 py-4 rounded-full text-xl font-bold hover:bg-red-600 transform hover:scale-105 transition-all"
          >
            ¡Comenzar!
          </button>
        </div>
      )}

      {/* Preguntas */}
      {gameState === 'playing' && (
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
            <img
              src={questions[currentQuestion].image}
              alt="Pregunta"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {questions[currentQuestion].question}
            </h2>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full bg-pink-100 hover:bg-pink-200 text-pink-800 py-3 px-4 rounded-lg text-left font-medium transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div
            id="errorMessage"
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-lg hidden"
          >
            ¡ESA NOOOO, LA OTRAAAA! 😅
          </div>
        </div>
      )}

      {/* Propuesta final */}
      {gameState === 'proposal' && (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-8">
            ¿QUIERES SER MI VALENTINE'S? 💝
          </h1>
          <div className="space-x-4">
            <button
              onClick={handleAccept}
              className="bg-green-500 text-white px-8 py-4 rounded-full text-xl font-bold hover:bg-green-600 transform hover:scale-105 transition-all"
            >
              ¡Sí! 💖
            </button>
            <button
              onMouseEnter={moveNoButton}
              style={{
                position: 'absolute',
                top: noButtonPosition.top,
                left: noButtonPosition.left,
                transform: 'translate(-50%, -50%)'
              }}
              className="bg-red-500 text-white px-8 py-4 rounded-full text-xl font-bold transition-all duration-200"
            >
              No 😢
            </button>
          </div>
        </div>
      )}

      {/* Mensaje de aceptación con efectos rave */}
      {gameState === 'accepted' && (
        <div 
          className="fixed inset-0 flex flex-col items-center justify-center"
          style={{
            animation: 'backgroundRave 0.5s infinite',
            background: 'rgba(128, 0, 128, 0.8)',
            overflow: 'hidden'
          }}
        >
          {/* Imágenes rebotando */}
          {bouncingImages.map((img) => (
            <div
              key={img.id}
              style={{
                width: '200px',
                height: '200px',
                position: 'fixed',
                left: img.position.x,
                top: img.position.y,
                zIndex: 10
              }}
            >
              <img
                src="/images/titiBG.png"
                alt="Bouncing"
                className="w-full h-full object-contain"
                draggable="false"
              />
            </div>
          ))}

          {/* Contenido estático */}
          <div className="text-center relative z-20">
            <h1 className="text-6xl font-bold text-white text-stroke">
              ¡TE AMO BBCIN RIN RIN PIN TIN!!! ❤️
            </h1>
            <div className="mt-8">
              <Heart className="w-40 h-40 text-white mx-auto" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValentineApp;