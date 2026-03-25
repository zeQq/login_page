import React, { useEffect, useRef, useState } from 'react';

interface SolidEyeProps {
  size?: number;
  maxDistance?: number;
  pupilColor?: string;
  forceLookX?: number;
  forceLookY?: number;
}

const SolidEye: React.FC<SolidEyeProps> = ({
  size = 12,
  maxDistance = 5,
  pupilColor = '#2D2D2D',
  forceLookX,
  forceLookY,
}) => {
  const eyeRef = useRef<HTMLDivElement>(null);
  const [pupilTransform, setPupilTransform] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (forceLookX !== undefined && forceLookY !== undefined) {
        return;
      }
      if (!eyeRef.current) return;
      const rect = eyeRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.min(Math.sqrt(dx ** 2 + dy ** 2), maxDistance);
      const angle = Math.atan2(dy, dx);
      setPupilTransform({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [forceLookX, forceLookY, maxDistance]);

  const finalTransform = 
    forceLookX !== undefined && forceLookY !== undefined 
      ? { x: forceLookX, y: forceLookY } 
      : pupilTransform;

  return (
    <div
      ref={eyeRef}
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${finalTransform.x}px, ${finalTransform.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  );
};

interface WhiteEyeProps {
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  forceLookX?: number;
  forceLookY?: number;
}

const WhiteEye: React.FC<WhiteEyeProps> = ({
  size = 48,
  pupilSize = 16,
  maxDistance = 10,
  eyeColor = 'white',
  pupilColor = 'black',
  isBlinking = false,
  forceLookX,
  forceLookY,
}) => {
  const eyeRef = useRef<HTMLDivElement>(null);
  const [pupilTransform, setPupilTransform] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (forceLookX !== undefined && forceLookY !== undefined) {
        return;
      }
      if (!eyeRef.current) return;
      const rect = eyeRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.min(Math.sqrt(dx ** 2 + dy ** 2), maxDistance);
      const angle = Math.atan2(dy, dx);
      setPupilTransform({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [forceLookX, forceLookY, maxDistance]);

  const finalTransform = 
    forceLookX !== undefined && forceLookY !== undefined 
      ? { x: forceLookX, y: forceLookY } 
      : pupilTransform;

  return (
    <div
      ref={eyeRef}
      className="rounded-full flex items-center justify-center relative transition-all duration-150"
      style={{
        width: `${size}px`,
        height: isBlinking ? '2px' : `${size}px`,
        backgroundColor: eyeColor,
        overflow: 'hidden',
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${finalTransform.x}px, ${finalTransform.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      )}
    </div>
  );
};

export interface AnimatedCharactersProps {
  isTyping: boolean;
  showPassword: boolean;
  passwordLength: number;
}

export const AnimatedCharacters: React.FC<AnimatedCharactersProps> = ({
  isTyping = false,
  showPassword = false,
  passwordLength = 0,
}) => {
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isReadingPassword, setIsReadingPassword] = useState(false);
  const [isLookingAtEmail, setIsLookingAtEmail] = useState(false);

  useEffect(() => {
    let timeoutId1: ReturnType<typeof setTimeout>;
    let timeoutId2: ReturnType<typeof setTimeout>;

    const blinkPurple = () => {
      timeoutId1 = setTimeout(() => {
        setIsPurpleBlinking(true);
        setTimeout(() => {
          setIsPurpleBlinking(false);
          blinkPurple();
        }, 150);
      }, Math.random() * 4000 + 3000);
    };

    const blinkBlack = () => {
      timeoutId2 = setTimeout(() => {
        setIsBlackBlinking(true);
        setTimeout(() => {
          setIsBlackBlinking(false);
          blinkBlack();
        }, 150);
      }, Math.random() * 4000 + 3000);
    };

    blinkPurple();
    blinkBlack();

    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
    };
  }, []);


  // Reading password random glances
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let innerTimeoutId: ReturnType<typeof setTimeout>;

    if (passwordLength > 0 && showPassword) {
      timeoutId = setTimeout(() => {
        setIsReadingPassword(true);
        innerTimeoutId = setTimeout(() => {
          setIsReadingPassword(false);
        }, 800);
      }, Math.random() * 3000 + 2000);
    }

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(innerTimeoutId);
    };
  }, [passwordLength, showPassword, isReadingPassword]);

  useEffect(() => {
    if (isTyping) {
      // setIsLookingAtEmail is handled differently to avoid sync setState warning
      const t1 = setTimeout(() => setIsLookingAtEmail(true), 0);
      const t2 = setTimeout(() => setIsLookingAtEmail(false), 800);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      const t1 = setTimeout(() => setIsLookingAtEmail(false), 0);
      return () => clearTimeout(t1);
    }
  }, [isTyping]);


  // Custom transform states to avoid directly accessing refs during render
  const [transforms, setTransforms] = useState({
    purple: { faceX: 0, faceY: 0, bodySkew: 0 },
    black: { faceX: 0, faceY: 0, bodySkew: 0 },
    orange: { faceX: 0, faceY: 0, bodySkew: 0 },
    yellow: { faceX: 0, faceY: 0, bodySkew: 0 },
  });

  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const getTransform = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 3;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;

        return {
          faceX: Math.max(-15, Math.min(15, dx / 20)),
          faceY: Math.max(-10, Math.min(10, dy / 30)),
          bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
        };
      };

      setTransforms({
        purple: getTransform(purpleRef),
        black: getTransform(blackRef),
        orange: getTransform(orangeRef),
        yellow: getTransform(yellowRef),
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const isPasswordTypingHidden = passwordLength > 0 && !showPassword;
  
  const purpleTransform = transforms.purple;
  const blackTransform = transforms.black;
  const orangeTransform = transforms.orange;
  const yellowTransform = transforms.yellow;

  return (
    <div
      className="relative"
      style={{ width: '550px', height: '400px' }}
    >
      {/* Purple Character */}
      <div
        ref={purpleRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: '70px',
          width: '180px',
          height: isTyping || isPasswordTypingHidden ? '440px' : '400px',
          backgroundColor: '#6C3FF5',
          borderRadius: '10px 10px 0 0',
          zIndex: 1,
          transform:
            passwordLength > 0 && showPassword
              ? 'skewX(0deg)'
              : isTyping || isPasswordTypingHidden
              ? `skewX(${(purpleTransform.bodySkew || 0) - 12}deg) translateX(40px)`
              : `skewX(${purpleTransform.bodySkew || 0}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        <div
          className="absolute flex gap-8 transition-all duration-700 ease-in-out"
          style={{
            left:
              passwordLength > 0 && showPassword
                ? '20px'
                : isLookingAtEmail
                  ? '55px'
                  : `${45 + (purpleTransform.faceX || 0)}px`,
            top:
              passwordLength > 0 && showPassword
                ? '35px'
                : isLookingAtEmail
                  ? '65px'
                  : `${40 + (purpleTransform.faceY || 0)}px`,
          }}
        >
          <WhiteEye
            size={18}
            pupilSize={7}
            maxDistance={5}
            eyeColor="white"
            pupilColor="#2D2D2D"
            isBlinking={isPurpleBlinking}
            forceLookX={
              passwordLength > 0 && showPassword
                ? isReadingPassword ? 4 : -4
                : isLookingAtEmail ? 3 : undefined
            }
            forceLookY={
              passwordLength > 0 && showPassword
                ? isReadingPassword ? 5 : -4
                : isLookingAtEmail ? 4 : undefined
            }
          />
          <WhiteEye
            size={18}
            pupilSize={7}
            maxDistance={5}
            eyeColor="white"
            pupilColor="#2D2D2D"
            isBlinking={isPurpleBlinking}
            forceLookX={
              passwordLength > 0 && showPassword
                ? isReadingPassword ? 4 : -4
                : isLookingAtEmail ? 3 : undefined
            }
            forceLookY={
              passwordLength > 0 && showPassword
                ? isReadingPassword ? 5 : -4
                : isLookingAtEmail ? 4 : undefined
            }
          />
        </div>
      </div>

      {/* Black Character */}
      <div
        ref={blackRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: '240px',
          width: '120px',
          height: '310px',
          backgroundColor: '#2D2D2D',
          borderRadius: '8px 8px 0 0',
          zIndex: 2,
          transform:
            passwordLength > 0 && showPassword
              ? 'skewX(0deg)'
              : isLookingAtEmail
                ? `skewX(${1.5 * (blackTransform.bodySkew || 0) + 10}deg) translateX(20px)`
                : isTyping || isPasswordTypingHidden
                  ? `skewX(${1.5 * (blackTransform.bodySkew || 0)}deg)`
                  : `skewX(${blackTransform.bodySkew || 0}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        <div
          className="absolute flex gap-6 transition-all duration-700 ease-in-out"
          style={{
            left:
              passwordLength > 0 && showPassword
                ? '10px'
                : isLookingAtEmail
                  ? '32px'
                  : `${26 + (blackTransform.faceX || 0)}px`,
            top:
              passwordLength > 0 && showPassword
                ? '28px'
                : isLookingAtEmail
                  ? '12px'
                  : `${32 + (blackTransform.faceY || 0)}px`,
          }}
        >
          <WhiteEye
            size={16}
            pupilSize={6}
            maxDistance={4}
            isBlinking={isBlackBlinking}
            forceLookX={passwordLength > 0 && showPassword ? -4 : isLookingAtEmail ? 0 : undefined}
            forceLookY={(passwordLength > 0 && showPassword) || isLookingAtEmail ? -4 : undefined}
          />
          <WhiteEye
            size={16}
            pupilSize={6}
            maxDistance={4}
            isBlinking={isBlackBlinking}
            forceLookX={passwordLength > 0 && showPassword ? -4 : isLookingAtEmail ? 0 : undefined}
            forceLookY={(passwordLength > 0 && showPassword) || isLookingAtEmail ? -4 : undefined}
          />
        </div>
      </div>

      {/* Orange Character */}
      <div
        ref={orangeRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: '0px',
          width: '240px',
          height: '200px',
          zIndex: 3,
          backgroundColor: '#FF9B6B',
          borderRadius: '120px 120px 0 0',
          transform:
            passwordLength > 0 && showPassword
              ? 'skewX(0deg)'
              : `skewX(${orangeTransform.bodySkew || 0}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        <div
          className="absolute flex gap-8 transition-all duration-200 ease-out"
          style={{
            left:
              passwordLength > 0 && showPassword
                ? '50px'
                : `${82 + (orangeTransform.faceX || 0)}px`,
            top:
              passwordLength > 0 && showPassword
                ? '85px'
                : `${90 + (orangeTransform.faceY || 0)}px`,
          }}
        >
          <SolidEye
            size={12}
            maxDistance={5}
            pupilColor="#2D2D2D"
            forceLookX={passwordLength > 0 && showPassword ? -5 : undefined}
            forceLookY={passwordLength > 0 && showPassword ? -4 : undefined}
          />
          <SolidEye
            size={12}
            maxDistance={5}
            pupilColor="#2D2D2D"
            forceLookX={passwordLength > 0 && showPassword ? -5 : undefined}
            forceLookY={passwordLength > 0 && showPassword ? -4 : undefined}
          />
        </div>
      </div>

      {/* Yellow Character */}
      <div
        ref={yellowRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: '310px',
          width: '140px',
          height: '230px',
          backgroundColor: '#E8D754',
          borderRadius: '70px 70px 0 0',
          zIndex: 4,
          transform:
            passwordLength > 0 && showPassword
              ? 'skewX(0deg)'
              : `skewX(${yellowTransform.bodySkew || 0}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        <div
          className="absolute flex gap-6 transition-all duration-200 ease-out"
          style={{
            left:
              passwordLength > 0 && showPassword
                ? '20px'
                : `${52 + (yellowTransform.faceX || 0)}px`,
            top:
            passwordLength > 0 && showPassword
              ? '35px'
              : `${40 + (yellowTransform.faceY || 0)}px`,
          }}
        >
          <SolidEye
            size={12}
            maxDistance={5}
            pupilColor="#2D2D2D"
            forceLookX={passwordLength > 0 && showPassword ? -5 : undefined}
            forceLookY={passwordLength > 0 && showPassword ? -4 : undefined}
          />
          <SolidEye
            size={12}
            maxDistance={5}
            pupilColor="#2D2D2D"
            forceLookX={passwordLength > 0 && showPassword ? -5 : undefined}
            forceLookY={passwordLength > 0 && showPassword ? -4 : undefined}
          />
        </div>
        {/* Mouth */}
        <div
          className="absolute w-20 h-[4px] bg-[#2D2D2D] rounded-full transition-all duration-200 ease-out"
          style={{
            left:
              passwordLength > 0 && showPassword
                ? '10px'
                : `${40 + (yellowTransform.faceX || 0)}px`,
            top:
              passwordLength > 0 && showPassword
                ? '88px'
                : `${88 + (yellowTransform.faceY || 0)}px`,
          }}
        />
      </div>
    </div>
  );
};
