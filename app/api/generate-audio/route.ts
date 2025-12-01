import { Client } from "@gradio/client";
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// --- Configuration ---
// IMPORTANT: Replace with your current, active Gradio link
const GRADIO_URL = "https://c71e480c7469acb9f2.gradio.live"

// Replace with the path to your local reference audio file (e.g., 'path/to/my_voice.wav')
const REFERENCE_AUDIO_PATH = path.resolve("../../../public/audio/peter.mp3");

// The text content of the reference audio file
const REFERENCE_TEXT = " sticking out your guy out for the Rizzler. You're so skibbity. You're so fun and tax. I just want to be your Sigma. Freaking come here. Give me your Ohio."; 

// The text you want the model to generate in the cloned voice
const TEXT_TO_GENERATE = "Alright, listen up, Lois! This is the story of a haunted house... where the ghost wasn't a ghost, but... a really good cook! Yeah, that's right! So, these dumb kids move in, right? Thinking it's all spooky, cobwebs and all that jazz... but then, BAM! Smells of lasagna! They follow the smell... find the ghost-chef, and he's like, 'Wanna taste my meatloaf?' Honestly, what a twist! They eat the meatloaf... it's amazing. Turns out, the house wasn't haunted, just a guy with a culinary obsession and terrible social skills! And the twist? The ghost-chef... he's actually a relative of mine! That explains the cholesterol issues. Heh heh heh. Giggity!"; 



// --- Main Function ---
async function generateE2TTS() {
    try {
        console.log("1. Connecting to Gradio client...");
        const client = await Client.connect(GRADIO_URL);

        // 2. Read the local audio file into a stream/buffer for the client
        // const response_0 = await fetch("https://github.com/gradio-app/gradio/raw/main/test/test_files/audio_sample.wav");
        const response_0 = await fetch("https://drive.google.com/uc?export=download&id=1Olu_AQFs4u_5EaB0JZWe-aK6nr3v0MQD");
        const exampleAudio = await response_0.blob();
        const audioInput = exampleAudio;
        // const audioInput = fs.createReadStream(REFERENCE_AUDIO_PATH);
        
        console.log(`2. Sending request to /basic_tts for E2-TTS generation...`);

        // 3. Call the /basic_tts API endpoint
        const result:any = await client.predict("/basic_tts", { 
            ref_audio_input: audioInput,    
            ref_text_input: REFERENCE_TEXT, 
            gen_text_input: TEXT_TO_GENERATE,
            // remove_silence: true,           
            // nfe_slider: 4,                  
            // cross_fade_duration_slider: 0,  
            // speed_slider: 0.3,              
        });

        console.log("3. API Call Successful! Processing response...");
        
        // 4. Retrieve the synthesized audio data
        // The API returns a list of 3 elements: [0] Audio, [1] Spectrogram Image, [2] Ref Text
        const synthesizedAudioData = result.data[0]; 

        if (synthesizedAudioData && synthesizedAudioData.url) {
            console.log("✅ Synthesis Complete!");
            
            // This is the publicly accessible URL for the generated audio file (e.g., WAV).
            const audioDownloadURL = GRADIO_URL + synthesizedAudioData.url;
            
            console.log(`\n**Generated Audio URL (Your Output):** ${audioDownloadURL}`);
            console.log("The file is now accessible at this URL.");

            // Optional: You can add logic here to download the file using 'fetch' or a similar library.
            // For example: await downloadFile(audioDownloadURL, './generated_e2tts_audio.wav');

        } else {
            console.error("❌ Error: Audio data not found in the response.");
        }

    } catch (error) {
        console.error("An error occurred during TTS generation:", error);
    }
}

// Ensure your reference audio file exists before running
if (!fs.existsSync(REFERENCE_AUDIO_PATH)) {
    console.error(`\nFatal Error: Reference audio file not found at ${REFERENCE_AUDIO_PATH}`);
    console.error("Please create or adjust the path to a valid audio file.");
} else {
    generateE2TTS();
}