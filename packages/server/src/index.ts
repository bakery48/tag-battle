import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { RoomManager } from './RoomManager.js';
import { EVENTS } from './events.js';
import {
  PickMonsterSchema,
  DraftPickSchema,
  ArrangeSubmitSchema,
  PlayCardSchema,
} from './validation/payloads.js';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const roomManager = new RoomManager(io);

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Auto match-make on connect
  const room = roomManager.matchMake(socket.id);

  if (!room) {
    // Waiting for opponent
    socket.emit(EVENTS.ROOM_JOINED, { roomId: 'waiting', playerIndex: 0, status: 'waiting' });
  } else {
    // Both players matched
    const p1Idx = room.getPlayerIdx(room.playerSockets[0])!;
    const p2Idx = room.getPlayerIdx(room.playerSockets[1])!;

    io.to(room.playerSockets[0]).emit(EVENTS.ROOM_JOINED, {
      roomId: room.id,
      playerIndex: p1Idx,
      status: 'matched',
    });
    io.to(room.playerSockets[1]).emit(EVENTS.ROOM_JOINED, {
      roomId: room.id,
      playerIndex: p2Idx,
      status: 'matched',
    });

    room.emitToRoom(EVENTS.GAME_START, { roomId: room.id });
    room.emitToRoom(EVENTS.PHASE_CHANGE, { phase: 'pick' });
  }

  socket.on(EVENTS.PICK_MONSTER, (payload: unknown) => {
    const result = PickMonsterSchema.safeParse(payload);
    if (!result.success) {
      socket.emit(EVENTS.ERROR, { message: 'Invalid pick payload' });
      return;
    }
    const gameRoom = roomManager.getRoomBySocket(socket.id);
    if (!gameRoom) return;
    const idx = gameRoom.getPlayerIdx(socket.id);
    if (idx === null) return;
    gameRoom.handlePick(idx, result.data.front, result.data.rear);
  });

  socket.on(EVENTS.DRAFT_PICK, (payload: unknown) => {
    const result = DraftPickSchema.safeParse(payload);
    if (!result.success) {
      socket.emit(EVENTS.ERROR, { message: 'Invalid draft pick payload' });
      return;
    }
    const gameRoom = roomManager.getRoomBySocket(socket.id);
    if (!gameRoom) return;
    const idx = gameRoom.getPlayerIdx(socket.id);
    if (idx === null) return;
    gameRoom.handleDraftPick(idx, result.data.cardId);
  });

  socket.on(EVENTS.ARRANGE_SUBMIT, (payload: unknown) => {
    const result = ArrangeSubmitSchema.safeParse(payload);
    if (!result.success) {
      socket.emit(EVENTS.ERROR, { message: 'Invalid arrange payload' });
      return;
    }
    const gameRoom = roomManager.getRoomBySocket(socket.id);
    if (!gameRoom) return;
    const idx = gameRoom.getPlayerIdx(socket.id);
    if (idx === null) return;
    gameRoom.handleArrangeSubmit(idx, result.data.deckOrder);
  });

  socket.on(EVENTS.PLAY_CARD, (payload: unknown) => {
    const result = PlayCardSchema.safeParse(payload);
    if (!result.success) {
      socket.emit(EVENTS.ERROR, { message: 'Invalid play card payload' });
      return;
    }
    const gameRoom = roomManager.getRoomBySocket(socket.id);
    if (!gameRoom) return;
    const idx = gameRoom.getPlayerIdx(socket.id);
    if (idx === null) return;
    gameRoom.handlePlayCard(idx, result.data.cardId);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
    roomManager.removeSocket(socket.id);
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env['PORT'] ?? 3001;
httpServer.listen(PORT, () => {
  console.log(`Tag Battle server running on port ${PORT}`);
});
