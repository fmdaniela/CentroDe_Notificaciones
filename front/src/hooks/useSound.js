import { useRef, useCallback } from 'react';

export const useSound = () => {
  const audioRef = useRef(null);

  const play = useCallback(() => {
    try {
      // Si ya existe una instancia de audio, la reutilizamos
      if (!audioRef.current) {
        audioRef.current = new Audio('/notification-sound.wav');
        audioRef.current.volume = 0.5; // Volumen bajo
        audioRef.current.load(); // Precargar
      }
      
      // Reiniciar y reproducir
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => {
        console.log('Sonido no reproducido (puede ser normal):', e);
      });
    } catch (error) {
      console.log('Error con sonido:', error);
    }
  }, []);

  return { play };
};