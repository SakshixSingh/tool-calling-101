//this file will give you the logic to change the models based on the .env file and export the correct model to be used in the application

import { env } from "./env"
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { ChatGroq } from '@langchain/groq'
import type { BaseChatModel } from "@langchain/core/language_models/chat_models"

//low temperature - crisp summary 
//model name 

type modelOptions = {
    temperature?: number,
    maxTokens?: number,
}

export function getModel(options: modelOptions={}): BaseChatModel {
    const temp=options?.temperature ?? 0.2;

    switch(env.MODEL_PROVIDER){
        case 'gemini':
            return new ChatGoogleGenerativeAI({
                apiKey:env.GEMINI_API_KEY, 
                model: env.GEMINI_MODEL,
                temperature: temp})
         
        case 'groq':
            default:
            return new ChatGroq({
                apiKey:env.GROQ_API_KEY, 
                model: env.GROQ_MODEL,
                temperature: temp})        
    }
}