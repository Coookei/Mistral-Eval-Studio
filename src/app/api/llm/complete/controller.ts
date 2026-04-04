import { getServerSession } from '@/lib/getSession';
import { NextRequest, NextResponse } from 'next/server';
import { completionRequestSchema } from './schema';
import { completionService } from './service';

export const completionController = {
  complete: async (request: NextRequest): Promise<NextResponse> => {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);

    const parsed = completionRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    try {
      const result = await completionService.complete(parsed.data);
      return NextResponse.json(result);
    } catch (error) {
      console.error('LLM completion error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  },
};
