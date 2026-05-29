import type { Server } from 'socket.io';
import { GameRoom } from './GameRoom.js';

export class RoomManager {
  private rooms = new Map<string, GameRoom>();
  private waitingSocket: string | null = null;
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  private genRoomId(): string {
    return Math.random().toString(36).slice(2, 10);
  }

  joinOrCreate(socketId: string): { roomId: string; playerIndex: 0 | 1 } {
    if (this.waitingSocket && this.waitingSocket !== socketId) {
      // Match the waiting player
      const p1 = this.waitingSocket;
      const p2 = socketId;
      this.waitingSocket = null;

      const roomId = this.genRoomId();
      const room = new GameRoom(roomId, p1, p2, this.io);
      this.rooms.set(roomId, room);

      return { roomId, playerIndex: 1 };
    } else {
      this.waitingSocket = socketId;
      // Return a placeholder; real roomId assigned when opponent joins
      return { roomId: 'waiting', playerIndex: 0 };
    }
  }

  matchMake(socketId: string): GameRoom | null {
    if (this.waitingSocket && this.waitingSocket !== socketId) {
      const p1 = this.waitingSocket;
      const p2 = socketId;
      this.waitingSocket = null;

      const roomId = this.genRoomId();
      const room = new GameRoom(roomId, p1, p2, this.io);
      this.rooms.set(roomId, room);
      return room;
    } else {
      this.waitingSocket = socketId;
      return null;
    }
  }

  getRoomBySocket(socketId: string): GameRoom | undefined {
    for (const room of this.rooms.values()) {
      if (room.playerSockets[0] === socketId || room.playerSockets[1] === socketId) {
        return room;
      }
    }
    return undefined;
  }

  removeSocket(socketId: string): void {
    if (this.waitingSocket === socketId) {
      this.waitingSocket = null;
    }
    const room = this.getRoomBySocket(socketId);
    if (room) {
      this.rooms.delete(room.id);
    }
  }
}
