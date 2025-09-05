import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    // Solo crear el socket una vez
    if (!socketRef.current) {
      console.log("🔌 Creando instancia de socket...");
      
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3000", {
        transports: ["websocket"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // Event listeners
      socketRef.current.on("connect", () => {
        console.log("✅ Socket conectado:", socketRef.current.id);
        setConnected(true);
        setConnectionError(null);
      });

      socketRef.current.on("disconnect", (reason) => {
        console.log("❌ Socket desconectado:", reason);
        setConnected(false);
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("❌ Error de conexión:", error);
        setConnectionError(error.message);
        setConnected(false);
      });

      socketRef.current.on("admin_notification", (data) => {
        console.log("📨 Notificación recibida en contexto:", data);
      });
    }

    return () => {
      console.log("🧹 Cleanup del SocketProvider");
    };
  }, []);

  const value = {
    socket: socketRef.current,
    connected,
    connectionError
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket debe usarse dentro de SocketProvider");
  }
  return context;
}