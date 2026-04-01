import { NextResponse } from 'next/server'
import dbConnect, { getMongoDiagnostics } from '@/lib/dbConnect'

export async function GET() {
    if (process.env.ENABLE_DB_DIAGNOSTICS !== 'true') {
        return NextResponse.json(
            { ok: false, message: 'DB diagnostics are disabled' },
            { status: 403 }
        )
    }

    const before = getMongoDiagnostics()

    try {
        await dbConnect()
        const after = getMongoDiagnostics()
        return NextResponse.json(
            {
                ok: true,
                message: 'Database connection is healthy',
                before,
                after,
            },
            { status: 200 }
        )
    } catch (error) {
        const after = getMongoDiagnostics()
        return NextResponse.json(
            {
                ok: false,
                message: 'Database connection failed',
                error: {
                    name: error?.name || 'Error',
                    message: error?.message || 'Unknown error',
                    code: error?.code || null,
                },
                before,
                after,
            },
            { status: 500 }
        )
    }
}
