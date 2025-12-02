"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@gradio/client");
const fs = __importStar(require("fs"));
const https_1 = __importDefault(require("https"));
const GRADIO_URL = "mrfakename/E2-F5-TTS";
const REFERENCE_TEXT = "sticking out your guy out for the Rizzler. You're so skibbity. You're so fun and tax. I just want to be your Sigma. Freaking come here. Give me your Ohio.";
const TEXT_TO_GENERATE = "Lois, I swear my life is like a GPS that keeps yelling “recalculating” even when I'm standing still. Like yesterday, I tried to eat healthy, but the salad ran away faster than my motivation. Sometimes I feel like I peaked in high school… and I wasn't even in high school. You know, if my brain was any smoother, hospitals would use it as a slide. And hey, at least I'm doing better than the dinosaur who overslept the asteroid alarm. Man set one reminder and boom! Hit rock bottom. Literally. Makes you think though… if the universe wants to delete you, it doesn't even send a breakup text. Just a rock. Classic move.";
async function generateE2TTS() {
    try {
        const client = await client_1.Client.connect(GRADIO_URL);
        console.log("1. connect to model");
        const response_0 = await fetch("https://drive.google.com/uc?export=download&id=1Olu_AQFs4u_5EaB0JZWe-aK6nr3v0MQD");
        const exampleAudio = await response_0.blob();
        const audioInput = exampleAudio;
        console.log("2. got the audio");
        const result = await client.predict("/predict", {
            ref_audio: audioInput,
            ref_text: REFERENCE_TEXT,
            gen_text: TEXT_TO_GENERATE,
        });
        console.log("2. audio transcribed");
        const synthesizedAudioData = result.data[0];
        console.log("2. got result");
        if (synthesizedAudioData && synthesizedAudioData.url) {
            console.log("✅ Synthesis Complete!");
            const audioDownloadURL = synthesizedAudioData.url;
            try {
                const folder = "../../../outputs";
                !fs.existsSync(folder) && fs.mkdirSync(folder);
                https_1.default.get(audioDownloadURL, (res) => res.pipe(fs.createWriteStream(`${folder}/output.mp3`)));
                console.log("file download at " + folder + "/output.mp3");
            }
            catch (error) {
                console.log("error in saving file : " + error);
            }
            // Optional: You can add logic here to download the file using 'fetch' or a similar library.
            // For example: await downloadFile(audioDownloadURL, './generated_e2tts_audio.wav');
        }
        else {
            console.error("❌ Error: Audio data not found in the response.");
        }
    }
    catch (error) {
        console.error("An error occurred during TTS generation:", error);
    }
}
generateE2TTS();
//# sourceMappingURL=route.js.map