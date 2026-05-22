//simply calling a model 
//no tavily or web search involved

import { RunnableLambda } from "@langchain/core/runnables";
import { Candidate } from "./type";
import { getModel } from "../shared/models";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";



export const directBasedPath=RunnableLambda.from(
    async (input:{q:string,mode:"web" | "direct"}) : Promise<Candidate>=>{
        const model=getModel({temperature:0.2});

         const res = await model.invoke([
            new SystemMessage(
                [
                    "You answer questions clearly for beginners using your general knowledge.",
                    "Rules:",
                    "Be accurate and neutral.",
                    "5-8 sentences max.",
                    "Do not mention page summaries, sources, or browsing the web.",
                ].join("\n")
            ),
            new HumanMessage(input.q),
        ]);

        const finalAns = (
            typeof res === "string" ? res : String(res.content ?? "")
        ).trim();

        return {
            answer :finalAns,
            source :[],
            mode: 'direct'
        }
    }

)

