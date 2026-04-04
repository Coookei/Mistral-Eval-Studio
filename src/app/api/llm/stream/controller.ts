import { getServerSession } from '@/lib/getSession';
import { NextRequest, NextResponse } from 'next/server';
import { completionRequestSchema } from './schema';
import { streamingService } from './service';

export const streamController = {
  stream: async (request: NextRequest): Promise<Response | NextResponse> => {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);

    const parsed = completionRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    // any errors are caught and added to the stream
    const stream = streamingService.stream(parsed.data);

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  },
};
