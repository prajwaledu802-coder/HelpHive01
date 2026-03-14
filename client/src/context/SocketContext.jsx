import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

const SOCKET_EVENTS = [
  'system:welcome',
  'event:new',
  'event:updated',
  'event:deleted',
  'event:assignment-updated',
  'event:volunteer-joined',
  'volunteer:created',
  'volunteer:updated',
  'volunteer:deleted',
  'volunteer:approved',
  'volunteer:duty-updated',
  'resource:created',
  'resource:updated',
  'resource:deleted',
  'location:updated',
  'task:assigned',
  'task:status-updated',
  'disaster:alert',
  'message:new',
  'message:deleted',
  'notification:new',
  'csv:uploaded',
];

const formatEventMessage = (eventName, payload) => {
  switch (eventName) {
    case 'event:new':
      return `New event created: ${payload?.title || payload?.name || 'Untitled event'}`;
    case 'event:updated':
      return `Event updated: ${payload?.title || payload?.name || 'Untitled event'}`;
    case 'event:deleted':
      return `Event removed: ${payload?.id || 'unknown id'}`;
    case 'event:volunteer-joined':
      return `Volunteer joined event ${payload?.eventId || ''}`.trim();
    case 'event:assignment-updated':
      return `Volunteer assignments updated for event ${payload?.eventId || ''}`.trim();
    case 'volunteer:created':
      return `Volunteer added: ${payload?.name || payload?.fullName || 'Unknown volunteer'}`;
    case 'volunteer:updated':
      return `Volunteer updated: ${payload?.name || payload?.fullName || 'Unknown volunteer'}`;
    case 'volunteer:approved':
      return `Volunteer approved: ${payload?.name || payload?.fullName || 'Unknown volunteer'}`;
    case 'volunteer:duty-updated':
      return `Duty status changed to ${payload?.status || 'updated'}`;
    case 'volunteer:deleted':
      return `Volunteer removed: ${payload?.id || 'unknown id'}`;
    case 'resource:created':
      return `Resource created: ${payload?.resourceName || payload?.name || 'Unnamed resource'}`;
    case 'resource:updated':
      return `Resource updated: ${payload?.resourceName || payload?.name || 'Unnamed resource'}`;
    case 'resource:deleted':
      return `Resource removed: ${payload?.id || 'unknown id'}`;
    case 'location:updated':
      return `Live location updated for volunteer ${payload?.volunteerId || ''}`.trim();
    case 'task:assigned':
      return `Task assigned: ${payload?.title || payload?.taskId || 'new task'}`;
    case 'task:status-updated':
      return `Task status updated to ${payload?.status || 'updated'}`;
    case 'disaster:alert':
      return `Disaster alert: ${payload?.type || 'incident'} at ${payload?.location || 'unknown location'}`;
    case 'message:new':
      return `New admin message: ${payload?.title || 'Message'}`;
    case 'message:deleted':
      return `Message removed: ${payload?.id || 'unknown id'}`;
    case 'notification:new':
      return payload?.message || 'New notification available';
    case 'csv:uploaded':
      return `CSV uploaded: ${payload?.counts?.volunteers || 0} volunteers, ${payload?.counts?.events || 0} events synced`;
    case 'system:welcome':
      return payload?.message || 'Connected to HelpHive realtime channel';
    default:
      return `${eventName} received`;
  }
};

const isPlaceholderUrl = (value) => {
  const text = String(value || '').toLowerCase();
  return (
    !text ||
    text.includes('your-backend-name.onrender.com') ||
    text.includes('your-project') ||
    text.includes('example.com')
  );
};

const cleanApiToOrigin = (url) => String(url || '').replace(/\/api\/?$/, '').replace(/\/$/, '');

const getSocketUrl = () => {
  const explicit = String(import.meta.env.VITE_SOCKET_URL || '').trim();
  if (explicit && !isPlaceholderUrl(explicit)) {
    return cleanApiToOrigin(explicit);
  }

  const apiBase = String(import.meta.env.VITE_API_URL || '').trim();
  if (apiBase && !isPlaceholderUrl(apiBase)) {
    return cleanApiToOrigin(apiBase);
  }

  return 'http://localhost:10000';
};

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);
  const [liveEvents, setLiveEvents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('ngo_token');
    const socket = io(getSocketUrl(), {
      transports: ['websocket', 'polling'],
      auth: {
        token: token ? `Bearer ${token}` : undefined,
      },
    });

    socketRef.current = socket;

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    SOCKET_EVENTS.forEach((eventName) => {
      socket.on(eventName, (payload) => {
        const item = {
          id: `${eventName}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          eventName,
          payload,
          message: formatEventMessage(eventName, payload),
          at: new Date().toISOString(),
        };

        setLastEvent(item);
        setLiveEvents((prev) => [item, ...prev].slice(0, 25));
      });
    });

    return () => {
      SOCKET_EVENTS.forEach((eventName) => socket.off(eventName));
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, []);

  const value = useMemo(
    () => ({
      socket: socketRef.current,
      connected,
      lastEvent,
      liveEvents,
    }),
    [connected, lastEvent, liveEvents]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used inside SocketProvider');
  }

  return context;
};
