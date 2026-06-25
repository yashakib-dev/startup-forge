import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGO_DB_URI || '';
const dbName = process.env.AUTH_DB_NAME || 'startupForge';
const client = new MongoClient(uri);

async function getCollection() {
  if (!client.topology || !client.topology.isConnected?.()) {
    await client.connect();
  }
  return client.db(dbName).collection('opportunities');
}

function buildQuery(params) {
  const query = {};
  if (params.search) {
    query.$or = [
      { title: { $regex: params.search, $options: 'i' } },
      { description: { $regex: params.search, $options: 'i' } },
      { startupName: { $regex: params.search, $options: 'i' } },
      { role: { $regex: params.search, $options: 'i' } },
      { skills: { $elemMatch: { $regex: params.search, $options: 'i' } } },
    ];
  }
  if (params.commitment) {
    query.commitment = params.commitment;
  }
  if (params.founderId) {
    query.founderId = params.founderId;
  }
  return query;
}

export async function GET(request) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';
  const commitment = url.searchParams.get('commitment') || '';
  const founderId = url.searchParams.get('founderId') || '';
  const page = Number(url.searchParams.get('page') || 1);
  const limit = Number(url.searchParams.get('limit') || 0);

  const collection = await getCollection();
  const query = buildQuery({ search, commitment, founderId });
  const total = await collection.countDocuments(query);

  let cursor = collection.find(query).sort({ createdAt: -1 });
  if (limit > 0) {
    const normalizedPage = page >= 1 ? page : 1;
    cursor = cursor.skip((normalizedPage - 1) * limit).limit(limit);
  }

  const data = await cursor.toArray();
  const totalPages = limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1;

  return NextResponse.json({ data, total, totalPages });
}

export async function POST(request) {
  const payload = await request.json();
  const collection = await getCollection();
  const now = new Date().toISOString();
  const result = await collection.insertOne({
    ...payload,
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({ success: true, insertedId: result.insertedId.toString() });
}
