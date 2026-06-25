import { MongoClient, ObjectId } from 'mongodb';
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

function parseId(id) {
  try {
    return new ObjectId(id);
  } catch (error) {
    return null;
  }
}

export async function GET(request, { params }) {
  const { id } = params;
  const objectId = parseId(id);
  if (!objectId) {
    return NextResponse.json({ error: 'Invalid opportunity ID' }, { status: 400 });
  }

  const collection = await getCollection();
  const opportunity = await collection.findOne({ _id: objectId });
  if (!opportunity) {
    return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
  }

  return NextResponse.json(opportunity);
}

export async function PATCH(request, { params }) {
  const { id } = params;
  const objectId = parseId(id);
  if (!objectId) {
    return NextResponse.json({ error: 'Invalid opportunity ID' }, { status: 400 });
  }

  const payload = await request.json();
  const collection = await getCollection();
  const result = await collection.updateOne(
    { _id: objectId },
    { $set: { ...payload, updatedAt: new Date().toISOString() } }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const objectId = parseId(id);
  if (!objectId) {
    return NextResponse.json({ error: 'Invalid opportunity ID' }, { status: 400 });
  }

  const collection = await getCollection();
  const result = await collection.deleteOne({ _id: objectId });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, deletedCount: result.deletedCount });
}
