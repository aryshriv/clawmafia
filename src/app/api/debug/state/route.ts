import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { gameService } from '@/lib/gameService';
import { Game } from '@/models/Game';
import { MafiaGame } from '@/lib/game';

export async function GET() {
  await gameService.getLobby(); // ensure db connected
  await dbConnect();
  const gamesDocs = await Game.find({}).sort({ updatedAt: -1 }).lean();
  const games = gamesDocs.map((doc: any) => ({
    ...MafiaGame.fromData(doc).getState(),
    currentActorName: doc.currentActorName ?? null,
  }));

  const lobby = await gameService.getLobby();

  return NextResponse.json({
    games,
    lobbyCount: lobby.length
  });
}
