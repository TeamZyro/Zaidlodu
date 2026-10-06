import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";

function makeUid(firebaseUid) {
  return "ZL-" + Buffer.from(firebaseUid).toString("base64url").replace(/[^A-Z0-9]/gi,"").slice(0,10).toUpperCase();
}

export async function POST(request) {
  try {
    const {firebaseUid,email,displayName} = await request.json();
    if (!firebaseUid || !email) return NextResponse.json({error:"Login information is missing"}, {status:400});

    const db = await getDb();
    const users = db.collection("ludoking_users");
    let user = await users.findOne({firebaseUid});

    if (!user) {
      user = {firebaseUid,email,uid:makeUid(firebaseUid),displayName:null,friends:[],pendingRequests:[],createdAt:new Date()};
      await users.insertOne(user);
    }

    if (displayName?.trim() && !user.displayName) {
      await users.updateOne({firebaseUid},{$set:{displayName:displayName.trim().slice(0,20)}});
      user = await users.findOne({firebaseUid});
    }

    return NextResponse.json({uid:user.uid,email:user.email,displayName:user.displayName});
  } catch {
    return NextResponse.json({error:"Database error"}, {status:500});
  }
}
