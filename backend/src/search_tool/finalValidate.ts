//answer ,sources
//final polish

import { RunnableLambda } from "@langchain/core/runnables";
import { searchOutputSchema } from "../utils/schemas";
import { Candidate } from "./type";
import { getModel } from "../shared/models";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const finalValidateAndPolish =RunnableLambda.from(
    async (candidate : Candidate) =>{
        const finalDraft= {
            answer:candidate.answer,
            sources:candidate.source?? []
        }

        const parsed1=searchOutputSchema.safeParse(finalDraft);

        if(parsed1.success){
            return parsed1.data;
        }

        //one shot repair if the output is not in the correct format ( extra check )
        const repaired= await repairSearch(finalDraft);

        const parsed2 = searchOutputSchema.safeParse(finalDraft);

        if(parsed2.success){
            return parsed2.data;
        }
    }
)

async function repairSearch(obj:any): Promise<{answer:string, sources:string[]}>{
    const model=getModel({temperature:0.2});

    const res= await model.invoke(
        [
            new SystemMessage(
                [
                    "You fix JSON objects to match the required format",
                    "Respond only with valid json object",
                    "Schema :{ answer: string , sources : string[] ( url as strings )}"
                ].join("\n")
            ),

            new HumanMessage(
                 [
                    'Make this exactly as the schema and ensure that sources is always an array of strings',
                    "Input JSON :",
                    JSON.stringify(obj)
                 ].join("\n")
            )
        ]
    )

    const text = typeof res === "string" ? res : String(res.content ?? "")

    const json=extractJSON(text);

    return {
        answer : String(json.answer ?? "").trim(),
        sources : Array.isArray(json.sources) ? json.sources.map(String) : []
    }
}

function extractJSON(text:string){
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");
    
        if (start === -1 || end === -1 || end < start) {
            throw new Error("No valid JSON object found in the text.");
        }

        try{
            return JSON.parse(text.slice(start,end+1));
        }catch{
            return {}
        }
}