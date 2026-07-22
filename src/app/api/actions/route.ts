/**
 * GET /api/actions
 *
 * Отдаёт пул действий. Фронт использует его, когда движок работает
 * в remote-режиме и не хочет держать контент в бандле.
 */

import { NextResponse } from "next/server";
import { ACTION_POOL } from "@/lib/actionPool";
import { CATEGORY_LIST, STAT_LIST } from "@/lib/domain";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    {
      actions: ACTION_POOL,
      categories: CATEGORY_LIST,
      stats: STAT_LIST,
      version: 1,
    },
    { headers: { "Cache-Control": "public, max-age=300" } },
  );
}
