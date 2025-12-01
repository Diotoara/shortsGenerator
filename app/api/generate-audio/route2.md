
WORKING CODE TO GENERATE AUDIO
1. GO TO PYTHON AND RUN THE CODE TO CREATE API
2. RUN THIS CODE, WILL GENERATE TTS BUT IN A FEMALE E-GIRL TYPE VOICE
3. CAN CHANGLE MODEL, THERE IS ALSO A JAPANESE VOICE (CAN USE FOR MANGA CHOICE)

import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
  const {text} = await req.json();
  const response = await axios.post("http://localhost:8000/generate", {
    text: text
  });

  return NextResponse.json({
    success : true
  }, {
    status:200
  })

  console.log(response.data);
} 