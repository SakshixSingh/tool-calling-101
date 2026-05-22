

//after getting the output from openUrl logic - the file is converted from html to text 
// now we can use this text and send it to the summarize logic to get a concise summary of the content. 
// This is useful for the agent to quickly understand the main points of the content without having to read 
// through all the details.


import { get } from "node:http";
import { summarizeInputSchema, summarizeOutputSchema } from "./schemas";
import { getModel } from "../shared/models";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { normalize } from "node:path";

export async function summarize(text:string){

     const {text: raw}= summarizeInputSchema.parse({text})
     const clipped=clip(raw,4000);

     const model=getModel({temperature:0.2})

     //ask the model to summarize in ontrolled manner 
     const response=await model.invoke([
        new SystemMessage([
            "You are helpful assistant that writes short and accurate summaries",
            "Guidlines for summary :",
            "Be factual and avoid marketing language  and any slang",
            "only 5-8 sentences",
            "avoid using lists unless asked for it",
            "do not invent sources or references . You only summarize the given text",
            "Keep it readable for beginners."
        ].join(" ")),
        new HumanMessage([
            "Summarize the following content for a beginner friendly audience",
            "Focus on key points and remove fluff",
            "Text to summarize :",
            clipped 
        ].join(" "))
     ])

     const rawmodeloutput =
        typeof response === "string"
            ? response
            : String(response.content ?? "");

     const summary = normalizeSummary(rawmodeloutput)

     return summarizeOutputSchema.parse({summary});
}

function clip(text:string,max:number){
     
    return text.length >max ?text.slice(0,max) : text

}

function  normalizeSummary(summary:string){
    //remove extra newlines and spaces
    const t=summary.replace(/\s+/g," ").trim();
    return t.slice(0,2000);
}