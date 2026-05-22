//answer ,sources
//final polish

import { RunnableLambda } from "@langchain/core/runnables";
import { searchOutputSchema } from "../utils/schemas";
import { Candidate } from "./type";
import { getModel } from "../shared/models";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const finalValidateAndPolish = RunnableLambda.from(
    async (candidate: Candidate) => {
        const finalDraft = {
            answer: candidate.answer,
            source: candidate.source ?? [],
        };

        const parsed1 = searchOutputSchema.safeParse(finalDraft);

        if (parsed1.success) {
            return { ...parsed1.data, mode: candidate.mode };
        }

        // one-shot repair if the output is not in the correct format
        const repaired = await repairSearch(finalDraft);

        const parsed2 = searchOutputSchema.safeParse({
            answer: repaired.answer,
            source: repaired.source,
        });

        if (parsed2.success) {
            return { ...parsed2.data, mode: candidate.mode };
        }

        // last resort: return draft as-is with mode
        return { ...finalDraft, mode: candidate.mode };
    }
);

async function repairSearch(obj: { answer: string; source: string[] }): Promise<{ answer: string; source: string[] }> {
    const model=getModel({temperature:0.2});

    const res= await model.invoke(
        [
            new SystemMessage(
                [
                    "You fix JSON objects to match the required format",
                    "Respond only with valid json object",
                    "Schema :{ answer: string , source : string[] ( url as strings )}"
                ].join("\n")
            ),

            new HumanMessage(
                 [
                    'Make this exactly as the schema and ensure that source is always an array of URL strings',
                    "Input JSON :",
                    JSON.stringify(obj)
                 ].join("\n")
            )
        ]
    )

    const text = typeof res === "string" ? res : String(res.content ?? "")

    const json=extractJSON(text);

    const sourceList = Array.isArray(json.source)
        ? json.source
        : Array.isArray(json.sources)
          ? json.sources
          : [];

    return {
        answer: String(json.answer ?? obj.answer ?? "").trim(),
        source: sourceList.map(String),
    };
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